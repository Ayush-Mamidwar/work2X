const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { authenticateToken } = require('../utilities')
const User = require('../model/user.model')
const Note = require('../model/note.model')
// Create account
router.post('/create-account', async (req, res) => {
    const { fullName, email, password } = req.body

    if (!fullName) {
        return res.status(400).json({ error: true, message: "Full Name is required" })
    }

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" })
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" })
    }

    const isUser = await User.findOne({ email: email })
    if (isUser) {
        return res.json({ error: true, message: "User already exists" })
    }

    const user = new User({ fullName, email, password })
    await user.save()

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '36000m' })

    return res.json({ error: false, user, accessToken, message: "Registration Successful" })
})

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" })
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" })
    }

    const userInfo = await User.findOne({ email })
    if (!userInfo || !(await userInfo.checkPass(password, userInfo.password))) {
        return res.json({ error: true, message: 'Invalid credentials' })
    }

    const user = { user: userInfo }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '36000m' })

    return res.json({
        error: false,
        message: "Login Successful",
        email,
        accessToken
    })
})


//add note
router.post('/add-note',authenticateToken,async (req,res)=>{
    const {title, content, tags} = req.body
    const user = req.user.user
    
    if(!title){
        return res.status(400).json({error: true, message:"title is required"})
    }

    if(!content){
        return res.status(400).json({error: true, message:"content is required"})
    }
    console.log(user)
    try{
        const note  = await Note.create({title, content, tags: tags||[], userId: user._id })
        return res.json({error:false, note, message: "Note Added Successfully"})
    }catch(err){
        console.log(err)
        return res.status(500).json({error: true, message: "Internal server error"})
    }
})

//edit note
router.put('/edit-note/:noteId',authenticateToken, async(req,res)=>{
    const noteId = req.params.noteId
    const {title, content, tags, isPinned} = req.body
    const user = req.user.user
    if(!title && !content && tags){
        return res.status(400).json({error: true, message: "No changes provided"})
    }

    try{
        const note = await Note.findOne({_id:noteId, userId:user._id})

        if(!note){
            return res.status(404).json({error: true, message: "Note not found"})
        }

        if(title) note.title = title
        if(content) note.content = content
        if(tags) note.tags = tags
        if(isPinned) note.isPinned = isPinned

        await note.save()
        return res.json({error: false,note, message:"note updated successfully"})
    }catch(err){
        return res.status(500).json({
            error:true,
            message: "Internal server error"
        })
    }
})

// Get User
router.get('/get-user', authenticateToken,async (req, res) => {
    const {user} = req.user

    const isUser = await User.findOne({_id:user._id})
    if(!isUser){
        return res.sendStatus(401)
    }

    return res.json({user:{fullName: isUser.fullName, email: isUser.email, "id": isUser._id}, message:""})

})

//get all notes
router.get('/get-all-notes',authenticateToken,async(req,res)=>{
    const {user} = req.user

    try{
        const notes = await Note.find({userId:user._id}).sort({isPinned: -1})
        return res.json({error: false, notes, message: "All notes retrieved successfully"})
    }catch(err){
        return res.status(500).json({error:true, message:"Internal server error"})
    }
})

//delete note
router.delete('/delete-note/:noteId',authenticateToken,async(req,res)=>{
    const {user} = req.user
    const noteId = req.params.noteId
    try{
        const note = await Note.findOne({_id: noteId,userId:user._id})
        if(!note){
            return res.status(404).json({error: true, message:"Note not found"})
        }

        await Note.deleteOne({_id:noteId, userId: user._id})
        return res.json({error: false,  message: "Note deleted successfully"})
    }catch(err){
        return res.status(500).json({error:true, message:"Internal server error"})
    }
})

//update isPinned
router.put('/update-note-pinned/:noteId', authenticateToken, async(req,res)=>{
    const noteId = req.params.noteId
    const {isPinned} = req.body
    const user = req.user.user

    try{
        const note = await Note.findOne({_id:noteId, userId:user._id})

        if(!note){
            return res.status(404).json({error: true, message: "Note not found"})
        }
 
        note.isPinned = isPinned || false

        await note.save()
        return res.json({error: false,note, message:"note updated successfully"})
    }catch(err){
        return res.status(500).json({
            error:true,
            message: "Internal server error"
        })
    }
})

router.get('/search-notes/', authenticateToken, async(req,res)=>{
    const user = req.user.user
    const {query} = req.query

    if(!query){
        return res.status(400).json({error:true, message: "Search query is required"})
    }
    try{
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                // { title: { $regex: new RegExp(query, "i") } },
                // { content: { $regex: new RegExp(query, "i") } },
                { tags: { $in: [query]} } // Match notes with at least one tag that matches the query
            ]
        });
        

        return res.json({
            error:false,
            notes:matchingNotes,
            message:"Notes matching the search query retrieved successfully"
        })
    }catch(err){
        return res.status(500).json({
            error:true,
            message: "Internal server error"
        })
    }
})

module.exports = router

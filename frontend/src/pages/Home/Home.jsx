import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import ProfileInfo from "../../components/cards/ProfileInfo";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchbar/SearchBar";
import NoteCard from "../../components/cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from 'react-modal';
import axiosInstance from "../../utils/axiosInstance";
import moment from 'moment';
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/emptycard/EmptyCard";
import { LuArrowRightToLine } from "react-icons/lu";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = ({sideBarOpen, setSideBarOpen}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userInfo, setUserInfo] = useState();
  const navigate = useNavigate();
  const [allNotes, setAllNotes] = useState([]);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null
  });
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add"
  });
  const [isSearch, setIsSearch] = useState(false);

  const onLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      console.log('res', response);
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (err) {
      console.log("Can't fetch notes, please try again later");
    }
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", 'delete');
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log("An unexpected error occurred. Please try again later");
      }
    }
  };

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query }
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (err) {
      console.log('search error: ', err);
    }
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
        isPinned: !noteData.isPinned
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log('ispinned error: ', error);
    }
  };

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message: message,
      type
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: ""
    });
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    setSideBarOpen(false)
  }, []);

  return (
    <>
      <Sidebar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen}/>
      <div>
        <Navbar>  
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
          <ProfileInfo onLogout={onLogout} userInfo={userInfo} />
        </Navbar>
        
        <button className="bg-blue-500 p-2 text-white text-xl" onClick={() => setSideBarOpen(true)}>
            <LuArrowRightToLine />
        </button>

        <div className="container mx-auto">  
          {allNotes.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 mt-8">
              {allNotes.map((item, index) => (
                <NoteCard
                  key={index}
                  title={item.title}
                  date={moment(item.createdOn).format("Do MMM YYYY")}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteNote(item)}
                  onPinNote={() => updateIsPinned(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyCard isSearch={isSearch} />
          )}
        </div>

        <button
          className="w-16 h-16 flex items-center justify-center 
          rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10"
          onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
        >
          <MdAdd className="text-[32px] text-white" />
        </button>

        <Modal 
          isOpen={openAddEditModal.isShown} 
          onRequestClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
          style={{
            overlay: { backgroundColor: "rgba(0,0,0,0.2)" }
          }}
          contentLabel=""
          className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
        >
          <AddEditNotes 
            type={openAddEditModal.type}
            noteData={openAddEditModal.data}
            onClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
            getAllNotes={getAllNotes}
            showToastMessage={showToastMessage}
          />
        </Modal>

        <Toast 
          isShown={showToastMsg.isShown} 
          message={showToastMsg.message} 
          type={showToastMsg.type}
          onClose={handleCloseToast}
        />
      </div>
    </>
  );
};

export default Home;

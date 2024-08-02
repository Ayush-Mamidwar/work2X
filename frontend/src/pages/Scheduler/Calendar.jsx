import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'

const Calendar = (props) => {
    const localizer = momentLocalizer(moment);

    return (
        <BigCalendar {...props} localizer={localizer}/>
    );
}

export default Calendar;

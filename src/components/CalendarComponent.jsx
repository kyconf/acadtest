import React from 'react';
import { Calendar } from "@/components/ui/calendar"

const CalendarComponent = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <div className="main">
  <Calendar
    mode="single"
    selected={date}
    onSelect={setDate}
    className="rounded-md border"
  />
    </div>
  );
};

export default CalendarComponent; 
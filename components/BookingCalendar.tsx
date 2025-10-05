import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';

interface BookingCalendarProps {
  mentor: UserProfile;
  onClose: () => void;
  onConfirm: (mentor: UserProfile, date: Date, time: string) => void;
}

// Mock availability function
const getMockAvailability = (mentorId: string, date: Date): string[] => {
  // A pseudo-random generator based on mentorId and date to make it deterministic but varied
  const seed = date.getDate() + mentorId.charCodeAt(1);
  if (seed % 4 === 0 || date.getDay() === 0 || date.getDay() === 6) {
    return []; // No availability on some days, or weekends
  }
  const slots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'
  ];
  // Return a subset of slots based on the seed
  return slots.filter((_, index) => (seed + index) % 3 !== 0);
};


const BookingCalendar: React.FC<BookingCalendarProps> = ({ mentor, onClose, onConfirm }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableTimes([]);
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableTimes([]);
  };

  const handleDateClick = (day: number) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // Don't allow booking for past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newSelectedDate < today) return;

    setSelectedDate(newSelectedDate);
    setSelectedTime(null);
    setAvailableTimes(getMockAvailability(mentor.id, newSelectedDate));
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleConfirm = () => {
      if(selectedDate && selectedTime){
          setIsConfirmed(true);
          // Simulate API call and wait for confirmation screen
          setTimeout(() => {
              onConfirm(mentor, selectedDate, selectedTime);
          }, 1500);
      }
  }

  const daysInMonth = useMemo(() => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return date.getDate();
  }, [currentDate]);

  const firstDayOfMonth = useMemo(() => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return date.getDay();
  }, [currentDate]);

  const monthlyAvailability = useMemo(() => {
    const availableDays = new Set<number>();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date >= today) {
        if (getMockAvailability(mentor.id, date).length > 0) {
          availableDays.add(day);
        }
      }
    }
    return availableDays;
  }, [currentDate, daysInMonth, mentor.id]);


  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  
  const renderCalendar = () => {
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`blank-${i}`}></div>);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isPast = date < today;
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const hasAvailability = monthlyAvailability.has(day);
      
      const dayClasses = `relative h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200 text-sm ${
        isPast ? 'text-slate-600 cursor-not-allowed opacity-50' :
        isSelected ? 'bg-indigo-500 text-white shadow-lg scale-110' :
        'text-slate-300 hover:bg-slate-700 cursor-pointer'
      }`;

      return (
        <div key={day} onClick={() => !isPast && handleDateClick(day)} className={dayClasses}>
          {day}
          {hasAvailability && !isPast && (
            <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-400'}`}></span>
          )}
        </div>
      );
    });
    return [...blanks, ...days];
  };

  if (isConfirmed) {
      return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
              <div className="bg-slate-900 p-8 rounded-xl shadow-2xl text-center max-w-md border border-slate-700">
                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500 mb-4">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                 </div>
                 <h3 className="text-2xl font-bold text-white">Booking Confirmed!</h3>
                 <p className="text-slate-400 mt-2">
                    Your session with {mentor.name} on {selectedDate?.toLocaleDateString()} at {selectedTime} has been scheduled.
                 </p>
              </div>
          </div>
      )
  }

  const now = new Date();
  const isPrevMonthDisabled = currentDate.getFullYear() === now.getFullYear() && currentDate.getMonth() === now.getMonth();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-900/80 backdrop-blur-lg p-6 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700/60" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Book a session with {mentor.name}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-2xl font-bold">&times;</button>
        </div>

        <div>
            <div className="flex justify-between items-center mb-4 px-2">
                <button
                  onClick={handlePrevMonth}
                  disabled={isPrevMonthDisabled}
                  className="p-2 rounded-full hover:bg-slate-700 disabled:text-slate-600 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                  aria-label="Previous month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h3 className="font-semibold text-lg">{monthName} {year}</h3>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-full hover:bg-slate-700 transition-colors"
                  aria-label="Next month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500 mb-2 uppercase tracking-wider">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center">
                {renderCalendar()}
            </div>
        </div>

        {selectedDate && (
          <div className="mt-6 border-t border-slate-800 pt-4">
            <h4 className="font-semibold text-center mb-3">Available Times for {selectedDate.toLocaleDateString()}</h4>
            {availableTimes.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {availableTimes.map(time => (
                        <button 
                            key={time} 
                            onClick={() => handleTimeSelect(time)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTime === time ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-center text-slate-500 py-4">No available slots on this day.</p>
            )}
          </div>
        )}
        
        <div className="mt-8 flex justify-start gap-3 border-t border-slate-800 pt-4">
          <button 
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!selectedTime || !selectedDate}
            className="btn btn-primary"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;

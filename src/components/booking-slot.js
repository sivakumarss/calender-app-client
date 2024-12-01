import React, { useState, useEffect } from 'react';
import fetchBookingslot from '../calender-app-service/bookingslot-service';

const BookingSlots = () => {
    const initialBookedSlotTimes = ["11:00", "12:00", "12:30", "15:30"];

    const [bookingSlots, setBookingSlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);

    useEffect(() => {
        const fetchTimeSlots = async () => {
            const slots = await fetchBookingslot();
            console.log(slots);
            const updatedSlots = SetBookingSlotsAsUnavailable(slots, initialBookedSlotTimes);
            setBookingSlots(updatedSlots);
        };
        fetchTimeSlots();
    }, []);

    const SetBookingSlotsAsUnavailable = (slots, initialSlots) => {
        return slots.map(slot => {
            if (initialSlots.includes(slot.startTime)) {
                slot.bookingStatus = "unavailable";
            }
            return slot;
        });
    }

    const HandleSelectionClick = (object) => {
        if (object.bookingStatus === "unavailable" || object.bookingStatus === "booked") {
            // Do nothing as this slot cannot be booked
        } else if (object.bookingStatus === "selected") {
            if (object.slotId !== selectedSlots[0]?.slotId &&
                object.slotId !== selectedSlots[selectedSlots.length - 1]?.slotId) {
                alert("You can only deselect the first or last selected time slot!");
            } else {
                object.bookingStatus = "available";
                setSelectedSlots(selectedSlots.filter(slot => slot.slotId !== object.slotId));
            }
        } else {
            if (selectedSlots.length === 0) {
                object.bookingStatus = "selected";
                setSelectedSlots([object]);
            } else if (object.slotId !== selectedSlots[0]?.slotId - 1 &&
                object.slotId !== selectedSlots[selectedSlots.length - 1]?.slotId + 1) {
                alert("You must select an adjacent time slot to those already selected!");
            } else {
                object.bookingStatus = "selected";
                setSelectedSlots([...selectedSlots, object].sort((a, b) => a.slotId - b.slotId));
            }
        }
    }

    const HandleConfirmClick = () => {
        setBookingSlots(bookingSlots.map(slot => {
            if (slot.bookingStatus === "selected") {
                slot.bookingStatus = "booked";
            }
            return slot;
        }));
        setBookedSlots([...bookedSlots, selectedSlots]);
        setSelectedSlots([]);
    }

    const HandleReturnSlotsClick = (slotArray) => {
        setBookingSlots(bookingSlots.map(slot => {
            if (slotArray.some(returnedSlot => returnedSlot.slotId === slot.slotId)) {
                slot.bookingStatus = "available";
            }
            return slot;
        }));
        setBookedSlots(bookedSlots.filter(bookedSlot => bookedSlot !== slotArray));
    }

    return (
        <React.Fragment>
            <h2>TAL Day Calendar Booking</h2>
            {selectedSlots.length > 0 &&
                <div className={"selectionWrapper"}>
                    <h4>Selected Booking Time</h4>
                    <div>
                        <div>{`Start Time: ${selectedSlots[0].startTime} - End Time: ${selectedSlots[selectedSlots.length - 1].endTime}`}
                            <button onClick={HandleConfirmClick}>Confirm Booking</button>
                        </div>
                    </div>
                </div>
            }
            <div className={"bookingSlotsWrapper"}>
                {bookingSlots.map(slot => (
                    <div className={`bookingSlot ${slot.bookingStatus}`} onClick={() => HandleSelectionClick(slot)}>
                        <div>{`${slot.startTime} - ${slot.endTime}`}</div>
                    </div>
                ))}
            </div>

            {bookedSlots.length > 0 &&
                <div className={"bookedSlotsWrapper"}>
                    <h4>Booked Times</h4>
                    {bookedSlots.map(slotArray => (
                        <div>
                            <div>
                                {`Start Time: ${slotArray[0].startTime} - End Time: ${slotArray[slotArray.length - 1].endTime}`}
                                <button onClick={() => HandleReturnSlotsClick(slotArray)}>Return Booking</button>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </React.Fragment>
    );
}

export default BookingSlots;

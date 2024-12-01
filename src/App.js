import './App.css';
import TimeSlots from './components/timeslots';
import BookingSlots from './components/booking-slot';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <TimeSlots/>*/}
        <BookingSlots />
      </header>
    </div>
  );
}

export default App;

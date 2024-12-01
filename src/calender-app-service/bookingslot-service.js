import axios from "axios";

const fetchBookingslot = async () =>{
    try{
        const response = await axios.get('https://localhost:44383/bookingslot');  // Modify the backend running service url  eg: localhost:xxxxx
        return response.data;
    } catch (error){
        console.error('Error fetching weather data', error);
        return [];
    }
};

export default fetchBookingslot;
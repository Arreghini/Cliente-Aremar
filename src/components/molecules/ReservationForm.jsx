import React, { useState } from 'react';
import reservationService from '../../services/ReservationService';
import PropTypes from 'prop-types';

const ReservationForm = ({ roomId, onReserve }) => {
  const [formData, setFormData] = useState({
    userId: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
  });

  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === 'numberOfGuests') {
      value = Math.max(1, Number(value)); // fuerza mínimo 1
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reservationService.createReservation({
        ...formData,
        roomId, // 🔑 lo agregamos acá, no en el state
      });
      onReserve();
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="userId">User ID</label>
      <input
        type="text"
        name="userId"
        id="userId"
        value={formData.userId}
        onChange={handleChange}
        placeholder="User ID"
        required
      />

      <label htmlFor="checkInDate">Check In Date</label>
      <input
        type="date"
        name="checkInDate"
        id="checkInDate"
        value={formData.checkInDate}
        onChange={handleChange}
        required
      />

      <label htmlFor="checkOutDate">Check Out Date</label>
      <input
        type="date"
        name="checkOutDate"
        id="checkOutDate"
        value={formData.checkOutDate}
        onChange={handleChange}
        required
      />

      <label htmlFor="numberOfGuests">Number of Guests</label>
      <input
        type="number"
        name="numberOfGuests"
        id="numberOfGuests"
        value={formData.numberOfGuests}
        onChange={handleChange}
        min="1"
        required
      />

      <button type="submit">Reserve</button>
    </form>
  );
};

ReservationForm.propTypes = {
  roomId: PropTypes.string.isRequired,
  onReserve: PropTypes.func.isRequired,
};

export default ReservationForm;

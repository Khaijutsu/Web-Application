import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFuelPricesContext } from "../../hooks/useFuelPricesContext";
import "./FuelQuote.css";

const FuelQuote = () => {
  const { dispatch } = useFuelPricesContext();
  const { user } = useAuthContext();

  const [gallonsReq, setGallonsReq] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [suggestedPrice, setSuggestedPrice] = useState("");
  const [totalAmountDue, setTotalAmountDue] = useState("");
  const [error, setError] = useState(null);

  const handleDateChange = (selectedDate) => {
    const formattedDate = format(selectedDate, "MM/dd/yyyy");
    setDeliveryDate(formattedDate);
  };

  const handleCalculation = () => {
    const gallons = parseFloat(gallonsReq);
    const price = parseFloat(suggestedPrice);

    if (!isNaN(gallons) && !isNaN(price)) {
      const calculatedTotal = gallons * price;
      setTotalAmountDue(calculatedTotal);
    } else {
      setTotalAmountDue(""); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const price = {
      gallonsReq,
      deliveryAddress,
      deliveryDate,
      suggestedPrice,
      totalAmountDue,
    };

    const response = await fetch("http://localhost:3001/prices", {
      method: "POST",
      body: JSON.stringify(price),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setgallonsReq(""); 
      setdeliveryAddress(null);
      setdeliveryDate("");
      setsuggestedPrice("");
      settotalAmountDue(""); 
      setError(null);
      dispatch({ type: "CREATE_FUELPRICE", payload: json });
    }
  };

  return (
    <form className="fQ" onSubmit={handleSubmit}>
      <h2>Fuel Quote</h2>
      <div class="row">
        <div class="col">
          {/* gallonsReq */}
          <h6>Gallons Requested</h6>
          <input
            type="text"
            id="gallonsReq"
            required
            onChange={(e) => setGallonsReq(e.target.value)}
            onBlur={handleCalculation}
          />

          {/* deliveryAddress */}
          <h6>Delivery Address</h6>
          <input
            type="text"
            id="deliveryAddress"
            required
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />

          {/* deliveryDate */}
          <h6>Delivery Date</h6>
          <DatePicker
            id="deliveryDate"
            placeholderText="Enter A Date"
            selected={deliveryDate ? new Date(deliveryDate) : null}
            dateFormat="MM/dd/yyyy"
            onChange={handleDateChange}
          />
        </div>
        <div class="col">
          {/* suggestedPrice */}
          <h6>Suggested Price</h6>
          <input
            type="text"
            id="gallonsReq"
            required
            onChange={(e) => setSuggestedPrice(e.target.value)}
            onBlur={handleCalculation}
          />

          {/* totalAmountDue */}
          <h6>Total Amount Due</h6>
          <input
            type="text"
            id="totalAmountDue"
            readOnly
            value={totalAmountDue}
          />
        </div>
      </div>
      <div className="fQButton">
        <button type="submit" class="btn btn-primary">
          Calculate
        </button>
      </div>
    </form>
  );
};

export default FuelQuote;
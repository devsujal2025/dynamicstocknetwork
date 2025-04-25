import React from "react";

function PaymentOptions() {
    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Payment Options</h2>
            <div className="card shadow-sm p-4">
                <h4>Select Payment Method</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <button className="btn btn-primary w-100">Credit/Debit Card</button>
                    </li>
                    <li className="list-group-item">
                        <button className="btn btn-primary w-100">Net Banking</button>
                    </li>
                    <li className="list-group-item">
                        <button className="btn btn-primary w-100">UPI</button>
                    </li>
                    <li className="list-group-item">
                        <button className="btn btn-primary w-100">Cash on Delivery</button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default PaymentOptions;

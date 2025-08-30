import React, { useEffect, useState } from "react";
import "../styling/Subscription.css";
import { FaCheck, FaTimes } from "react-icons/fa";

const Subscription = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data))
      .catch((err) => console.error("Error fetching plans:", err));
  }, []);

  return (
    <div className="subscription-container">
      {/* Left Section */}
      {/* Current Plan Row */}
      <div className="current-plan-row">
        <div className="plan-info">
          <p className="breadcrumb">Current Plan</p>
          <h2 className="plan-title">Free Plan</h2>
          <p className="valid-until">Valid until: December 31, 2023</p>
        </div>
        <span className="status-active">ACTIVE</span>
      </div>

      {/* Right Section */}
      <div className="subscription-right">
        <h2 className="choose-plan">Choose Your Plan</h2>
        <p className="choose-subtext">
          Select the perfect plan for your business needs
        </p>

        {/* Plans Section */}
        <div className="plans-container">
          {/* Free Plan */}
          <div className="plan-card">
            <h3 className="plan-name">{plans[0]?.plan_name || "Free"}</h3>
            <p className="plan-price">
              <span className="price-amount">₹{plans[0]?.plan_price || "0"}</span>
              <span className="price-period">/month</span>
            </p>{" "}
            <ul>
              <li>
                <FaCheck className="tick" /> 5 Bills per month
              </li>
              <li>
                <FaCheck className="tick" /> Basic analytics
              </li>
              <li>
                <FaCheck className="tick" /> Email support
              </li>
              <li>
                <FaCheck className="tick" /> 1 user
              </li>
            </ul>
            <button className="current-btn">Current Plan</button>
          </div>

          {/* Starter Plan */}
          <div className="plan-card">
            <h3 className="plan-name">{plans[1]?.plan_name || "Starter"}</h3>
            <p className="plan-price">
              <span className="price-amount">₹{plans[1]?.plan_price || "99"}</span>
              <span className="price-period">/month</span>
            </p>{" "}
            <ul>
              <li>
                <FaCheck className="tick" /> Unlimited bills
              </li>
              <li>
                <FaCheck className="tick" /> Advanced analytics
              </li>
              <li>
                <FaCheck className="tick" /> Priority support
              </li>
              <li>
                <FaCheck className="tick" /> 5 users
              </li>
              <li>
                <FaCheck className="tick" /> Custom branding
              </li>
              <li>
                <FaCheck className="tick" /> API access
              </li>
            </ul>
            <button className="upgrade-btn">Upgrade Now</button>
          </div>

          {/* Pro Plan */}
          <div className="plan-wrapper">
            <div className="most-popular">Most Popular</div>
            <div className="plan-card pro-card">
              <h3 className="plan-name">{plans[2]?.plan_name || "Pro"}</h3>
              <p className="plan-price">
                <span className="price-amount">₹{plans[2]?.plan_price || "199"}</span>
                <span className="price-period">/month</span>
              </p>{" "}
              <ul>
                <li>
                  <FaCheck className="tick" /> Unlimited everything
                </li>
                <li>
                  <FaCheck className="tick" /> Enterprise analytics
                </li>
                <li>
                  <FaCheck className="tick" /> 24/7 phone support
                </li>
                <li>
                  <FaCheck className="tick" /> Unlimited users
                </li>
                <li>
                  <FaCheck className="tick" /> Custom branding
                </li>
                <li>
                  <FaCheck className="tick" /> API access
                </li>
                <li>
                  <FaCheck className="tick" /> Advanced security
                </li>
                <li>
                  <FaCheck className="tick" /> Custom integrations
                </li>
              </ul>
              <button className="pro-btn">Upgrade Now</button>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="feature-comparison">
          <h2 className="feature-comparison-title">Feature Comparison</h2>
          <table>
            <thead>
              <tr>
                <th>Features</th>
                <th>Free</th>
                <th>Starter</th>
                <th>Pro</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Number of Bills</td>
                <td>5/month</td>
                <td>Unlimited</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>Analytics</td>
                <td>Basic</td>
                <td>Advanced</td>
                <td>Enterprise</td>
              </tr>
              <tr>
                <td>Support</td>
                <td>Email</td>
                <td>Priority</td>
                <td>24/7 Phone</td>
              </tr>
              <tr>
                <td>Users</td>
                <td>1</td>
                <td>5</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td> Custom Branding</td>
                <td>
                  <FaTimes className="cross" />
                </td>
                <td>
                  <FaCheck className="tick" />
                </td>
                <td>
                  <FaCheck className="tick" />
                </td>
              </tr>
              <tr>
                <td>API Access</td>
                <td>
                  <FaTimes className="cross" />
                </td>
                <td>
                  <FaCheck className="tick" />
                </td>
                <td>
                  <FaCheck className="tick" />
                </td>
              </tr>
              <tr>
                <td>Advanced Security</td>
                <td>
                  <FaTimes className="cross" />
                </td>
                <td>
                  <FaTimes className="cross" />
                </td>
                <td>
                  <FaCheck className="tick" />
                </td>
              </tr>
              <tr>
                <td>Custom Integrations</td>
                <td>
                  <FaTimes className="cross" />
                </td>
                <td>
                  <FaTimes className="cross" />
                </td>
                <td>
                  <FaCheck className="tick" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="footer">
          <p>Secure payment processing by</p>
          <div className="footer-logos">
            <img src="razorpay.png" alt="Razorpay" />
            <img src="learsfojg.png" alt="Lears Fojg" />
            <img src="paypal.png" alt="PayPal" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;

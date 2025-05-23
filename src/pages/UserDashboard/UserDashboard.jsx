import './UserDashboard.css'; // Import dashboard-specific styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faHistory } from '@fortawesome/free-solid-svg-icons';
import UserRoles from '../../component/UserRoles/user-roles.jsx';
import UserOrders from "../../component/user-orders/user-orders.jsx";

const UserDashboard = () => {

    return (
        <div className="container">
            <div className="dashboard-container">
                <h1 className="dashboard-title">Dashboard</h1>
                {/*<div className="user-info">*/}
                {/*    <h2>Dashboard</h2>*/}
                {/*</div>*/}

                {/*/!* User Roles Component *!/*/}
                <UserRoles />

                {/*/!*User Requests Component*!/*/}
                <UserOrders/>

                <div className="dashboard-content">
                    <div className="dashboard-card">
                        <div className="card-icon">
                            <FontAwesomeIcon icon={faCalendarCheck} />
                        </div>
                        <div className="card-content">
                            <h3>Upcoming Schedules</h3>
                            <p>Your cleaning schedules will appear here</p>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="card-icon">
                            <FontAwesomeIcon icon={faHistory} />
                        </div>
                        <div className="card-content">
                            <h3>Recent Activity</h3>
                            <p>Your recent activity will appear here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
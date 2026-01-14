import "./ProfilePage.scss";
import { CircleUser, Mail, Shield, User } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="avatar">
          <CircleUser size={60} />
        </div>
        <h1 className="title">{user?.fullName}</h1>
        <span className="badge">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</span>
      </div>

      <div className="content">
        <section className="section">
          <h2 className="section-title">Personal information</h2>

          <div className="card">
            <span className="card-logo">
                <Mail size={20}/>
            </span>
            <div>
              <span className="card-title">Email</span>
              <p className="card-info">{user?.email || "customer@shop.com"}</p>
            </div>
          </div>

          <div className="card">
            <span className="card-logo">
                <Shield size={20}/>
            </span>
            <div>
              <span className="card-title">Role</span>
              <p className="card-info">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</p>
            </div>
          </div>

          <div className="card">
            <span className="card-logo">
                <User size={20}/>
            </span>
            <div>
              <span className="card-title">Name</span>
              <p className="card-info">{user?.fullName}</p>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Access</h2>

          <div className={`access ${user?.role}`}>
            {user?.role === "customer" ?
                <User /> :
                <Shield/>
            }
            <div>
              <strong className="access-state">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</strong>
              <p className="access-info">{(user?.role === "customer") ?
                    "You can see catalog and add products to cart" :
                    "You have admin rights"}</p>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Settings</h2>

          <Link to="/orders" className="link">View orders</Link>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
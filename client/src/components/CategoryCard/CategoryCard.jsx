import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import "./CategoryCard.scss";

const CategoryCard = ({ category, onDelete }) => {
  return (
    <div className="category-card">
      <div className="card-left">
        <h3 className="title">{category.name}</h3>
        <p className="description">{category.description}</p>
      </div>

      <div className="card-actions">
        <Link to={`/admin/categories/edit/${category._id}`} className="edit btn">
          <Pencil size={16} /> Edit
        </Link>
        
        <button className="delete btn" onClick={onDelete}>
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  )
}

export default CategoryCard;
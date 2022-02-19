import { Link } from "react-router-dom"
import './paginateBox.css'
export const PaginateBox = ({ text, link }) => {

    return <Link onClick={() => console.log(link)} className="paginate-box" to={`${link}`}>{text}</Link>
}
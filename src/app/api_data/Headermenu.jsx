import { FaCalendar, FaClock, FaHome } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { MdHomeRepairService } from "react-icons/md";

export const HeaderData = [
    {
        title: 'dashboard',
        slug: '/dashboard',
        icon: <FaHome />
    },
    {
        title: 'doctors',
        slug: '/doctors',
        icon: <FaUserDoctor />
    },
    {
        title: 'services',
        slug: '/services',
        icon: <MdHomeRepairService />
    },
    {
        title: 'appointments',
        slug: '/appointments',
        icon: <FaClock />
    },
]
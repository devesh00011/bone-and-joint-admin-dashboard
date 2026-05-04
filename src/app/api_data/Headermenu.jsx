import { FaCalendar, FaClock, FaHome, FaMicroblog } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { MdContactEmergency, MdHomeRepairService, MdMore } from "react-icons/md";

export const HeaderData = [
    {
        title: 'dashboard',
        slug: '/dashboard',
        icon: <FaHome />
    },
    {
        title: 'about us',
        slug: '/about-us',
        icon: <MdMore />
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
        title: 'blogs',
        slug: '/blogs',
        icon: <FaMicroblog />
    },
    {
        title: 'appointments',
        slug: '/appointments',
        icon: <FaClock />
    },
    {
        title: 'enquiries',
        slug: '/enquiries',
        icon: <MdContactEmergency />
    },
]
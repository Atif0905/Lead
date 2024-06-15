import './Sidebar.css';

const Excecutivesidebar = () => {
  return (
    <div>
    <div className="sidebarabovediv"></div>
    <div className='excecutiveside'>
        <img src='./grouplogo.webp' className='sidebarlogo mb-3' alt=''/>
            <div className="d-flex sideanchor "><img src="./dashboardicon.webp" className="sidebaricon" alt="icon"/><li className=''>Dashboard</li></div>
            <div className="d-flex sideanchor"><img src="./projectsicon.webp" className="sidebaricon" alt="icon"/><li>Project</li></div>
            <div className="d-flex sideanchor"><img src="./dashboardicon.webp" className="sidebaricon" alt="icon"/><li>Dashboard</li></div>
            <div className="d-flex sideanchor"><img src="./projectsicon.webp" className="sidebaricon" alt="icon"/><li>Project</li></div>
            <div className="d-flex sideanchor"><img src="./dashboardicon.webp" className="sidebaricon" alt="icon"/><li>Dashboard</li></div>
            <div className="d-flex sideanchor"><img src="./projectsicon.webp" className="sidebaricon" alt="icon"/><li>Project</li></div>
            <div className="d-flex sideanchor"><img src="./dashboardicon.webp" className="sidebaricon" alt="icon"/><li>Dashboard</li></div>
            <div className="d-flex sideanchor"><img src="./projectsicon.webp" className="sidebaricon" alt="icon"/><li>Project</li></div>
    </div>
    </div>
  )
}

export default Excecutivesidebar
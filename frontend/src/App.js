import Page8 from "./components/Page8";
import Page7 from "./components/Page7";
import Page6 from "./components/Page6";
import Page5 from "./components/Page5";
import Page4 from "./components/Page4";
import Page3 from "./components/Page3";
import Login from "./components/Login/Login";
import Signup from "./components/Signup";

import './App.css';
import { Route, Routes } from 'react-router-dom';
import Edit from './components/Edit/Edit';

// import Feedback from "./user/pages/Feedback";
import Mainlayout from "./user/layouts/Mainlayout";
import Home from "./user/pages/Home";
import Sickmeal from "./user/pages/SickMeal";
import UploadMenu from "./admin/pages/UploadMenu";
import AddFeast from "./admin/pages/AddFeast";
import EditMenu from "./admin/pages/EditMenu";
import WeeklyRatings from "./admin/pages/WeeklyRatings";
import Page404 from "./admin/pages/Page404";
import Feedback from "./admin/pages/Feedback";
import AdminLayout from "./admin/layouts/AdminLayout";
import UserFeedback from "./user/pages/UserFeedback";
import Menu from "./user/pages/Menu";
import WeekMenu from "./user/pages/WeekMenu";
import SickMeals from "./admin/pages/SickMeals";

function App() {
  return (
    <Routes>
      <Route path='/home' element={<Home />}/>
      <Route path='/page3' element={<Page3 />}/>
      <Route path='/page4' element={<Page4 />}/>
      <Route path='/page5' element={<Page5 />}/>
      <Route path='/page6' element={<Page6 />}/>
      <Route path='/page7' element={<Page7 />}/>
      <Route path='/page8' element={<Page8 />}/>      
      <Route path='/edit' element={<Edit/>}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/login' element={<Login />}/>

      {/* User routes */}
      <Route path='/' element={<Mainlayout/>}>
        <Route index element={<Home />} />
        <Route path='menu' element={<Menu />} />
        <Route path='weekmenu' element={<WeekMenu />} />
        <Route path='feedback' element={<UserFeedback />} />
        <Route path='sickmeal' element={<Sickmeal />} />
      </Route>
      
      {/* Admin routes */}
      <Route path='/admin' element={<AdminLayout />}>
        <Route index element={<WeeklyRatings />} />
        <Route path='upload-menu' element={<UploadMenu />} />
        <Route path='edit-menu' element={<EditMenu />} />
        <Route path='feedback' element={<Feedback />} />
        <Route path='sick-meal' element={<SickMeals />} />
        <Route path='*' element={<Page404 />} />
      </Route>
    </Routes>
  );
}
export default App;

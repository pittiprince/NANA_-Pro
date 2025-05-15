import '../../../src/componentsStyle.css'
import { useNavigate } from 'react-router-dom';

import { LoginPage } from './LoginPage';
export const LandingPage = () =>{
    const navigate = useNavigate(); 
    const redirectLoginPage = () => {
        navigate('/loginPage'); // Redirect to the login page
    };
    const redirectsignupPage = () => {
        navigate('/signupPage'); // Redirect to the login page
    };
    

    return (
        <div id='landingPageBody'>
            <div id="navBar">
                <h3>BrainStrom</h3>
                <h3>@pittiPrince</h3>
            </div>
            <div id="heroSection">
               <p>Give Your Ideas</p>
               <p id='life'>The Life</p>
            </div>
            <div id="buttons">
                <button onClick={redirectLoginPage}>Login</button>
                <button onClick={redirectsignupPage}>SignUp</button>
            </div>
            <div id="image">
                <p>Bring your messy ideas on to canvas in a innovative way , and much more ! </p>
            </div>
        </div>
    )

   
      
}
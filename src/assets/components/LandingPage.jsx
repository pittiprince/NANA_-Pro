import '../../../src/componentsStyle.css'
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
    const navigate = useNavigate(); 
    const redirectToCanvas = () => {
        navigate('/canvas');
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
                <button onClick={redirectToCanvas}>Create Canvas</button>
            </div>
            <div id="image">
                <p>Bring your messy ideas on to canvas in a innovative way , and much more!</p>
            </div>
        </div>
    )
}
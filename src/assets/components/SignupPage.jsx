
import '../../../src/componentsStyle.css'
export const SignupPage = () =>{
    return (
        <div id="main-signpPage">
             <p>BrainStrom</p>
            <div id="SignupComponent">
            <input type="text"  placeholder='Enter Your Name  '/>
                <input type="text"  placeholder='Enter Your Username'/>
                <input type="password" placeholder='Enter Your Password' />
                <button>Submit</button>
            </div>
        </div>
    )
}
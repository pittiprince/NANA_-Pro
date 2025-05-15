import '../../../src/componentsStyle.css'
export const LoginPage = () =>{
return (
    <div id="main-LoginPage">
         <p>BrainStrom</p>
        <div id="LoginComponent">
            <input type="text"  placeholder='Enter Your Username'/>
            <input type="password" placeholder='Enter Your Password' />
            <button>Submit</button>
        </div>
    </div>
)
}
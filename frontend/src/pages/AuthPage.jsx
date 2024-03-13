import SignupCard from '../components/SignupCard'
import Login from '../components/Login'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'

function AuthPage() {
    const authSceenState = useRecoilValue(authScreenAtom);
    //const [value, setValue] = useState("login");
    //useSetRecoilState(authScreenAtom)
    console.log(authSceenState)
    return (
        <>
            {authSceenState === 'login' ? <Login /> : <SignupCard />}
        </>
    )
}

export default AuthPage
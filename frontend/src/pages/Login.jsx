import Form from "../components/Form"
import AuthRedirect from "../components/AuthRedirect"

function Login(){
    return (
        <AuthRedirect>
            <Form route="/api/token/" method="login"/>
        </AuthRedirect>
    )
}
export default Login
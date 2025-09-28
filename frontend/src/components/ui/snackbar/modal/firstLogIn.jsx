import { Button, Checkbox, Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import api from "../../../../api";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Snackbar from '@mui/material/Snackbar';
import {useSnackbar} from 'notistack'
import {Spinner} from 'flowbite-react'


export default function FirstLogin() {
  const { enqueueSnackbar } = useSnackbar();
  const [openModalConfirm, setOpenModalConfirm] = useState(true);
const [openModal, setOpenModal] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const [loading, setLoading] = useState(false);
  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
  }

  

   const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);  // Toggle the state to switch between "text" and "password"
    };

  const handleSubmit = async (e) =>{
    e.preventDefault()
    setLoading(true)
    try{
      api.post("api/change-password/",{"new_password":newPassword}).then((res)=>{
        console.log(res.data)
        enqueueSnackbar("Password successfully changed!", {
  variant: "success",
  anchorOrigin: {
    vertical: "top",
    horizontal: "center",
  },
});
setOpenModalConfirm(false)
setOpenModal(false)
setLoading(false)
localStorage.setItem('passswordChanged','true')
      })
    }
    catch(error){
      console.log(error)
      setLoading(false)
    }
  }

  
  const spinner = () => {
        return <Spinner aria-label="Medium sized spinner example" size="sm" />
    }
  return (
    <>
    <Modal
      show={openModalConfirm}
      size="md"
      onClose={() => setOpenModalConfirm(false)}
      popup
    >
      <ModalHeader />
      <ModalBody>
        <div className="text-center">
        
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Change Your Password
          </h3>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            Welcome! Since this is your first time logging in, please update
            your password to secure your account.
          </p>
          <div className="flex justify-center gap-4">
            <Button color="blue" onClick={() => setOpenModal(true)}>
              Change Password
            </Button>
            <Button color="alternative" onClick={() => setOpenModalConfirm(false)}>
              Remind Me Later
            </Button>
          </div>
          
        </div>
      </ModalBody>
    </Modal>

     <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6">
              <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Change Your Password</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="new_password">New Password</Label>
              </div>
              <div className="relative mb-3">
                        <TextInput
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                           id="new_password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <VisibilityIcon className="h-5 w-5 text-gray-500" /> : <VisibilityOffIcon className="h-5 w-5 text-gray-500" />}
                        </button>
                    </div>
          
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="confirm_password">Confirm Password</Label>
              </div>
               <div className="relative mb-3">
                        <TextInput
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                           id="confirm_password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <VisibilityIcon className="h-5 w-5 text-gray-500" /> : <VisibilityOffIcon className="h-5 w-5 text-gray-500" />}
                        </button>
                    </div>
            </div>
            <div className="w-full">
              <Button color={"blue"} type="submit" className="flex gap-2 items-center"> <p className="me-2">Change Password</p> {loading && spinner()}</Button>
            </div>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </>
);
}

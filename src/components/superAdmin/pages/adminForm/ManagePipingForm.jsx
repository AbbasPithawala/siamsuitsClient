import React, { useState, useContext } from "react";
import { Context } from "../../../../context/Context";
import { axiosInstance } from "../../../../config";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function ManagePipingForm(){

  const [pipingCode, setPipingCode] = useState("")
  const [supplierName, setSupplierName] = useState("");
  const { user } = useContext(Context)
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = async(e) => {
    e.preventDefault()
    
    const newPiping = {
      piping:{
        pipingCode:pipingCode,
        supplierName:supplierName
      },
      token:user.data.token
    }
    if(pipingCode =="" || supplierName==""){
      setOpen(true)
      setError(true)
      setErrorMsg("Please fill this input!")
    }else{
      if(file){
        const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("name", filename);
        data.append("image", file);
        const res = await axiosInstance.post("image/upload", data)
        newPiping.piping.image = res.data.data
      }
      const res = await axiosInstance.post("/piping/create", newPiping)
      if(res.data.status==true){
        setOpen(true)
        setSuccess(true)
        setSupplierName("")
        setPipingCode("")
      }else{
        setOpen(true)
        setError(true)
        setErrorMsg(res.data.message)
      }
    }
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccess(false)
    setOpen(false)
    setError(false)
  }

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  )
 
    return(
      <main className="main-panel">
        <div className="content-wrapper">
          <div className="order-table manage-page">
            <div className="top-heading-title">
              <strong> Add Piping </strong>
              </div>
                <div className="factory-user-from-NM pd-15">       
                 <form onSubmit = {handleSubmit}>
                   <div className="form-group">
                      <div className="col">
                        <div className="searchinput-inner">
                          <p>Piping Code <span className="red-required">*</span></p>
                          <input className="searchinput" type="text" value={pipingCode} onChange={(e) => setPipingCode(e.target.value)}/>
                        </div>
                      </div>
                      <div className="col">
                       <div className="searchinput-inner">
                          <p>Supplier Name <span className="red-required">*</span></p>
                          <input className="searchinput" type="text" value={supplierName} onChange={(e) => setSupplierName(e.target.value)}/>
                        </div>
                      </div>
                      <div className="col">
                        <div className="searchinput-inner">
                          <form  encType="multipart/form-data" >
                           
                            <div className="input-file-outer">
                              <label className='input-file-button' htmlFor="fileInput">CHOOSE FILE</label>
                              {file && <img src={URL.createObjectURL(file)} alt="custom-pic" /> }
                              <input type="file"  name='image' id="fileInput"  className="inputfile-button" onChange={(e) =>setFile(e.target.files[0])}/>
                            </div>
                          </form>
                        </div>
                      </div>
                    <div className="col savesumitbtnnm">
                      <input type="submit" className="custom-btn" value="SAVE"/>
                    </div>
                  </div>
                  {success && (
                    <Snackbar
                      open={open}
                      autoHideDuration={2000}
                      onClose={handleClose}
                    >
                      <Alert
                        onClose={handleClose}
                        severity="success"
                        sx={{ width: "100%" }}
                      >
                        Piping created successfully!
                      </Alert>
                    </Snackbar>
                  )}
                  {error && (
                  <Snackbar
                    open={open}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    action={action}
                  >
                    <Alert
                      onClose={handleClose}
                      severity="error"
                      sx={{ width: "100%" }}
                    >
                      {errorMsg}
                    </Alert>
                  </Snackbar>
                )}
               </form>  
              </div>          
            </div>
        </div>
    </main>
    )
}

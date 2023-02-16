import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from "react-modal";
import { url } from "./config";

const App = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [employeData, setEmployeData] = useState([]);
  const [searchTerm,  setSearchTerm] = useState("");
  const [editTableNo, setEditTableNo] = useState(null);
  const [selected, setSelected] = useState(undefined);
  const [empdata, setEmpdata] = useState({
    name:"",
    role:"",
    gender
  })

  const {name, role, gender} = empdata;

  const onInputChnage = (e)=>{
    setEmpdata({...empdata,[e.target.name]:e.target.value})
  }

  const handleOpen = (e)=>{
    setModalIsOpen(true)
  }
  const handleClose = (e)=>{
    setModalIsOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const role = e.target.elements.role.value;
    const gender = e.target.elements.gender.value;
    if (editTableNo !== null) {
      setEmployeData(
        employeData.map((employe, index) => {
          if (index === editTableNo) {
            return { name, role, gender };
          }
          return employe;
        })
      );
    } else {
      setEmployeData([...employeData, { name, role, gender }]);
    }
    handleClose();
  };


  // function handleEdit (index) {
  //   setEditTableNo(index);
  //   setModalIsOpen(true);
  // };

  // function handleDelete(index){
  //   setEmployeData(employeData.filter((employe, i)=>i!== index))
  // }

  const handleSearch = (e)=>{
    setSearchTerm(e.target.value)
  }


  function findAllEmployees(){
    axios.get(url.API+"employees/", {headers:{"content-Type":"application/json"}})
    .then(res=>{
      if(res.data.length>0) setEmployeData(res.data)
    })
    .catch(err=>{
      console.log(err)
    })
  }


  const filteredData = employeData.filter(
    employe =>
      employe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employe.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employe.gender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function addNewEmployee(){
    axios.post(url.API+"addNewEmployee/",{
      name:"",
      role:"",
      gender:[male, female]
    })
    .then(res=>{
      if(res.data.length>0) {
        setEmployeData(res.data)
      }
    })
    .catch(err=>{
      console.log(err)
    })
  }

  function updateEmployees(){
    axios.patch(url.API+"editEmployees/:id/"+arguments[0], arguments.length>1?arguments[1]:employeData,{
      headers:{"content-Type":"application/json"}
    })
    .then((res)=> {
      if(selectedIndex.current>=0 && modalIsOpen){
        if (selected === selectedIndex.current){ 
            setSelected(null)
        }
        else {
            setSelected(selectedIndex.current);
        }
    }
    else
    {
        setSelected(null)
    }
    })
  }

  return (
    <>
    <nav class="navbar navbar-light bg-dark">
      <div class="container-fluid">
        <img src="https://www.adobe.com/content/dam/cc/us/en/creativecloud/design/discover/mascot-logo-design/mascot-logo-design_fb-img_1200x800.jpg" style ={{width:"50px", height:"50px"}}alt="company logo" />
      <form class="d-flex">
        <input class="form-control me-2" type="search" placeholder="Search"  onChange={handleSearch} />
        <button class="btn btn-outline-success" type="submit" >Search</button>
      </form>
        <button className="btn btn-outline-light" onClick={handleOpen}>Create</button>
      </div>
    </nav>

      <Modal isOpen={modalIsOpen} onRequestClose={handleClose}>
        <h2>Create Employee Record</h2>
        <form onSubmit={handleSubmit}>
        <div class="mb-3">
          <label for="exampleInputName" class="form-label">Name</label>
          <input type="text" class="form-control" id="exampleInputName" name = "name" value={empdata.name} onChange={onInputChnage} required/>
        </div>
        <div class="mb-3">
          <label for="exampleInputRole" class="form-label">Role</label>
          <input type="text" class="form-control" name = "role" value={empdata.role} onChange={onInputChnage} required/>
      </div>
              Gender<br></br><br></br>
           <input type="radio" name="gender" value={empdata.gender.male} onChange={onInputChnage} /> Male<br/>
           <input type="radio" name="gender" value={empdata.gender.female}  onChange={onInputChnage} /> Female
          <br />
          <button type="submit" class="btn btn-primary" onClick={() => addNewEmployee()}>Submit</button>
        </form>
      </Modal>
      <div className='fixed-bottom'>
            <button className='btn btn-light border d-flex float-end m-3'  onClick={() => findAllEmployees()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
            </button>
        </div>
      <div style={{padding:"20px", margin:"20px"}}>
      <table class="table table-primary table-stripped" > 
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Role</th>
            <th>Gender</th>
            <th>Changes</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((data, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{data.name}</td>
              <td>{data.role}</td>
              <td>{data.gender}</td>
              <td><button className="btn btn-primary" onClick={() => updateEmployees()}>Edit</button></td>
              <td><button className="btn btn-danger" onClick={() => {
                if (confirm("the user will be deleted."))
                {
                  axios.delete(url.API+"employee/"+employeData._id)
                  .then(()=>{
                      SetAlert({
                        show:true,
                        message:"The form deleted successfully!",
                        type:"secondary",
                      })
                  })
                  .catch((err)=>{
                    console.log(err.message)
                    setAlert({
                      show:true,
                      message:err.message,
                      type:"danger",
                    })
                  })
                }
              }}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
};

export default App;

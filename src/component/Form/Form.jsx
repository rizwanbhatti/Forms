import React, { useState } from 'react';
import { Button,Dialog,DialogHeader,DialogBody,DialogFooter} from "@material-tailwind/react";
import jsPDF from 'jspdf';
import { Modal, Upload } from 'antd';
import { db, collection, addDoc, getDocs, ref, uploadBytes, storage, getDownloadURL, setDoc, doc } from '../../config/firebase';
import Swal from 'sweetalert2';
import PrintableComponent from '../../component/PDFFile';
import Img from '../../Asset/Header.jpg'
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export default function Form() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(!open);
    const [selectedGender, setSelectedGender] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    let latestFile;
    const handleChange = ({ fileList: newFileList }) => {
        if (newFileList.length > 0) {
            latestFile = newFileList[newFileList.length - 1];
            setFileList([latestFile]);
            console.log(latestFile);
        } else {
            setFileList([]);

        }
    };

    const handleGenderChange = (event) => {
        setSelectedGender(event.target.value);
    };

    // PDF fun


    // const DownloadPDFButton = () => {
    // }

    const handleDownloadClick = () => {
        const doc = new jsPDF();
        doc.text('i m zeeshan', 10, 10);
        doc.save('sample.pdf');
    };

    const handleSubmit = async () => {




        let name = document.getElementById("name");
        let email = document.getElementById("email");
        let fname = document.getElementById("fname");
        let city = document.getElementById("city");
        let cnic = document.getElementById("cnic");
        let phone = document.getElementById("phone");
        let dob = document.getElementById("dob");
        let qualification = document.getElementById("qualification");
        let address = document.getElementById("address");
        let gender = document.getElementById("gender");
        let errorMsg = ""
        if (!name.value || !email.value || !fname.value || !city.value || !cnic.value || !phone.value || !dob.value || !qualification.value || !address.value || !gender.value) {
            if (!name.value) errorMsg += "- Name\n";
            if (!email.value) errorMsg += "- Email\n";
            if (!fname.value) errorMsg += "- Father Name\n";
            if (!city.value) errorMsg += "- City\n";
            if (!cnic.value) errorMsg += "- CNIC\n";
            if (!phone.value) errorMsg += "- Phone\n";
            if (!dob.value) errorMsg += "- Date of Birth\n";
            if (!qualification.value) errorMsg += "- Qualification\n";
            if (!address.value) errorMsg += "- Address\n";
            if (!gender.value) errorMsg += "- Gender\n";

            Swal.fire({
                icon: 'error',
                title: 'Following Fields are Required.',
                text: `${errorMsg}`,
            })
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
        const phonePattern = /^\d{11}$/;
        if (!fileList[0]) {
            Swal.fire({
                icon: 'error',
                title: 'Image Required.',
            })
        }

        // Validate email, CNIC, and phone number
        if (!emailPattern.test(email.value)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email Address.'
            })
            return;
        }
        if (!cnicPattern.test(cnic.value)) {
            Swal.fire({
                icon: 'error',
                title: "Invalid CNIC number. Format should be: 12345-1234567-1"
            })
            return;
        }
        if (!phonePattern.test(phone.value)) {
            Swal.fire({
                icon: 'error',
                title: "Invalid phone number. Phone number should be 11 digits long."
            })
            return;
        }


        let random;
        while (true) {
            random = Math.floor(Math.random() * 9000 + 1000);;

            // Check if the generated roll number exists in the database
            const rollNumberSnapshot = await getDocs(collection(db, "rollnumber"));
            let rollNumberExists = false;

            rollNumberSnapshot.forEach((doc) => {
                if (doc.data().roll === random) {
                    rollNumberExists = true;
                }
            });

            if (!rollNumberExists) {
                break; // Break the loop if the roll number is unique
            }
        }

        try {
            const docRef = await addDoc(collection(db, "rollnumber"), {
                roll: random,
            });
            console.log("Document written with ID: ", docRef.id);

            // Rest of your code to add user data to Firestore
        } catch (e) {
            console.error("Error adding document: ", e);
        }


        console.log(random);




        try {
            const docRef = await addDoc(collection(db, "Students"), {
                name: name.value,
                email: email.value,
                fname: fname.value,
                city: city.value,
                cnic: cnic.value,
                phone: phone.value,
                DateOfBirth: dob.value,
                qualification: qualification.value,
                address: address.value,
                gender: gender.value,
                status: "painding",
                rollNumber: random,
                pic: ''
            });

            const storageRef = ref(storage, `images/${docRef.id}`);
            uploadBytes(storageRef, fileList[0].originFileObj).then((snapshot) => {
                console.log('Uploaded a blob or file!');

            }).then(() => {



                getDownloadURL(ref(storage, `images/${docRef.id}`))
                    .then(async (url) => {
                        await setDoc(doc(db, "Students", docRef.id), {
                            name: name.value,
                            email: email.value,
                            fname: fname.value,
                            city: city.value,
                            cnic: cnic.value,
                            phone: phone.value,
                            DateOfBirth: dob.value,
                            qualification: qualification.value,
                            address: address.value,
                            gender: gender.value,
                            status: "painding",
                            rollNumber: random,
                            pic: url
                        });
                        let std = {
                            uid: docRef.id,
                            pic: url
                        }
                        localStorage.setItem("Student", JSON.stringify(std))
                        alert("data submited")
                        setOpen(!open)
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })



        } catch (e) {
            console.error("Error adding document: ", e);
        }



    };

    return (
        <div>
            <button onClick={handleDownloadClick}>Download PDF</button>
            <div className="flex flex-col text-center w-full mt-12">
                        <h1 className="sm:text-3xl text-2xl font-bold title-font mb-4 text-gray-900 ">Course Registration Form</h1>
                        <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Service-Education-Registration</p>
                    </div>

            <section className="text-gray-600 body-font relative">
                <div className="container px-5  mx-auto">
                    <div class="container px-5 py-12 mx-auto flex flex-wrap">
                        <div class="lg:w-2/3 mx-auto">
                            <div class="flex flex-wrap w-full bg-gray-100 py-32 px-10 relative">
                                <img alt="gallery" class="w-full object-fit h-full object-center block opacity-15 absolute inset-0" src={Img} />

                            </div>
                        </div>
                    </div>
                  
                    <div className="lg:w-1/2 md:w-2/3 mx-auto">
                        <div className="flex flex-wrap -m-2">
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label for="name" className="leading-7 text-sm text-gray-600">Full Name</label>
                                    <input type="text" placeholder='Full Name' id="name" name="name" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label for="email" className="leading-7 text-sm text-gray-600">Email</label>
                                    <input type="email" id="email" name="email" placeholder='Email' className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>

                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label for="fname" className="leading-7 text-sm text-gray-600">Father Name</label>
                                    <input type="text" placeholder='Father Name' id="fname" name="fname" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>

                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label for="city" className="leading-7 text-sm text-gray-600">City</label>
                                    <input type="text" placeholder='Select City' id="city" name="name" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label for="cnic" className="leading-7 text-sm text-gray-600">CNIC/BFORM</label>
                                    <input type="text" placeholder='CNIC' id="cnic" name="cnic" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label for="phone" className="leading-7 text-sm text-gray-600">Phone</label>
                                    <input type="number" placeholder='Phone' id="phone" name="phone" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label for="dob" className="leading-7 text-sm text-gray-600">Date of birth</label>
                                    <input type="date" placeholder='Date of birth' id="dob" name="dob" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label className="leading-7 text-sm text-gray-600">Gender</label>
                                    <div className="w-ful">
                                        <select
                                            id="gender"
                                            value={selectedGender}
                                            onChange={handleGenderChange}
                                            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                        >
                                            <option value=''>Select Gender</option>
                                            <option value='Male'>Male</option>
                                            <option value='Female'>Female</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2 w-full">
                                <div className="relative">
                                    <label for="qualification" className="leading-7 text-sm text-gray-600">Qualification</label>
                                    <input type="text" placeholder='Qualification' id="qualification" name="qualification" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>


                            <div className="p-2 w-full">
                                <div className="relative">
                                    <label for="Address" className="leading-7 text-sm text-gray-600">Address</label>
                                    <input type="text" placeholder='Address' id="address" name="address" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-full">
                                <div className="relative">
                                    <label for="Address" className="leading-7 text-sm text-gray-600">Picture</label>
                                    <Upload
                                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={handlePreview}
                                        onChange={handleChange}
                                        id='img' >
                                        {fileList.length === 0 && 'Upload'} {/* Corrected condition */}
                                    </Upload>
                                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                                        <img
                                            alt="example"
                                            style={{
                                                width: '100%',
                                            }}
                                            src={previewImage}
                                        />
                                    </Modal>
                                </div>
                            </div>

                            <div className="p-2 w-full">
                                <button onClick={handleSubmit} className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Submit</button>

                                <Button onClick={handleOpen} variant="gradient">
                                    Open Dialog
                                </Button>
                                <Dialog
                                    open={open}
                                    handler={handleOpen}
                                    animate={{
                                        mount: { scale: 1, y: 0 },
                                        unmount: { scale: 0.9, y: -100 },
                                    }}
                                >
                                    <DialogHeader className='flex justify-center' >Form Submit Successfully.</DialogHeader>
                                    <DialogBody divider>
                                        <PrintableComponent></PrintableComponent>

                                    </DialogBody>
                                    <DialogFooter>
                                        <Button
                                            variant="text"
                                            color="red"
                                            onClick={handleOpen}
                                            className="mr-1"
                                        >
                                            <span>Cancel</span>
                                        </Button>

                                    </DialogFooter>
                                </Dialog>

                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

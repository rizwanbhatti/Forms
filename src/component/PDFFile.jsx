import React, { useRef, useEffect, useState } from "react";
import ReactToPrint from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import '../component/style.css';
import { db, collection, getDocs, ref, onSnapshot, uploadBytes, storage, getDownloadURL, query, where } from '../config/firebase';
import { Button } from "@material-tailwind/react";

class ComponentToPrint extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const uid = JSON.parse(localStorage.getItem("Student"));
    const q = collection(db, "Students");
    this.unsubscribe = onSnapshot(q, (snapshot) => {
      const newData = [];
      snapshot.forEach((doc) => {
        if (uid.uid === doc.id) {
          newData.push(doc.data());
        }
      });
      this.setState({ data: newData });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { data } = this.state;
    const { pic } = this.props;

    if (data.length === 0) {
      return null; // Handle loading state or no data found
    }

    const student = data[0];
    return (


      <div>
        <div class="flex justify-center flex-col items-center p-10 md:py-16">
          <div class="bg-white w-full md:w-4/5 shadow flex justify-center max-w-7xl border-2 border-t-green-500 border-b-green-500 border-l-slate-700 border-r-slate-700  ">
            <div class="">
              <h3 class="text-teal-600 text-1xl md:text-2xl font-bold ml-4">ID Card </h3>
              <div class="flex items-center justify-center space-x-0">
                <div class="mr-5 mt-5 flex flex-col items-center justify-between lg:flex-row bg-white">
                  <div class="px-5 text-black flex flex-col w-full lg:w-[100%] ">
                    <div class="text-left mb-8 mr-5">
                      <h1 class=" text-lg "> <span className="text-teal-600"> Roll No </span>:<span className="font-bold" > {student.rollNumber}  </span></h1>
                      <h1 class=" text-lg  w-64 flex"> <span className="text-teal-600"> Name </span>: <span className="font-bold " > {student.name} </span></h1>
                      <h1 class=" text-lg  w-64 flex"> <span className="text-teal-600">Father Name </span>: <span className="font-bold " > {student.fname}  </span></h1>
                      <h1 class=" text-lg "> <span className="text-teal-600" > City </span>: <span className="font-bold" > {student.city}  </span></h1>
                    </div>
                  </div>
                </div>
                <div className="mb-8 h-28  img-pdf" >
                  <img id="img" src={this.props.pic} className="h-full  mb-8" alt="" />
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-center bg-gray-700 pl-3 pr-3 text-white">
                    Q3
                  </span>
                  <span className="text-center bg-green-800 pl-3 pr-3  text-white">
                    WMD
                  </span>
                </div>
                <div>
                  <h5 className="text-end mb-5  ">
                    <span className="border-2 border-t-black border-b-0 border-r-0 border-l-0 pl-5 text-center p-2"> Authorized Sign</span>
                  </h5>
                </div>
              </div>

            </div>
          </div>
          <div>
            <p className="text-center mt-5 text-sm">AssalamuAlaikum Yeh Id card Students ka hai iska khayal rakhe</p></div>
        </div>
      </div>
    );
  }
}

const PrintableComponent = () => {
  let pic = JSON.parse(localStorage.getItem("Student"));
  const componentRef = useRef();
  const downloadPDF = () => {

    const contentDiv = document.querySelector(".pdf-content");
    const contentWidthInPixels = getComputedStyle(contentDiv).width;
    const contentWidthInMillimeters = (parseFloat(contentWidthInPixels) / 96) * 25.4;
    const input = componentRef.current;
    console.log(input);
    html2canvas(input, { scale: 118 / 100 }).then((canvas) => {
      console.log(canvas);

    });



  };

  return (
    <div>
      <ComponentToPrint pic={pic.pic} ref={componentRef} />
      <div className="flex justify-center">

        <ReactToPrint
          trigger={() => <Button className="bg-green-600 flex justify-center " onClick={downloadPDF}>Please Download Id Card</Button>}
          content={() => componentRef.current}

        />
      </div>

    </div>
  );
};

export default PrintableComponent;

import React, { useEffect, useState } from "react";
import DashboardHeader from "../dashboard/DashboardHeader/DashboardHeader";
import DashboardHero from "../dashboard/DashboardHero/DashboardHero";
import CollapseBlock from "../dashboard/CollapseBlockLeft/collapseblockleft";
import AmountPicker from "./auxiliary/AmountPicker";
import CollapseBlockRight from "../dashboard/collapseblockright/collapseblockright";
import { PaystackConsumer, usePaystackPayment } from "react-paystack";
import { postRequest } from "../apiRequests/requestApi";
import CustomErrorMsg from "../errorMsg/CustomErrorMsg";

export default function Deposit() {
  const [isLeftBlockOpen, setIsLeftBlockOpen] = useState(true);
  const [isRightBlockOpen, setIsRightBlockOpen] = useState(true);
  const [blocksOpen, setBlocksOpen] = useState("both");
  const [value, setValue] = useState(2000);
  const [apiReqs, setApiReqs] = useState({ isLoading: false, data: null, errorMsg: null })

  const [payStackComponentProps, setPayStackComponentProps] = useState({
    reference: new Date().getTime().toString(),
    email: "olomufeh@gmail.com",
    amount: value*100,
    publicKey: "pk_test_77b7c00c5d7243d94da713ca2c6815eae23f99a5",
    onSuccess: (reference) => {
      setApiReqs({
        isLoading: true, 
        errorMsg: null, 
        data: {
          amount: value
        }
      })
    },
    onClose: () => setApiReqs({ isLoading: false, data: null, errorMsg: 'Deposit cancelled' })
  })

  useEffect(() => {
    if (isLeftBlockOpen && isRightBlockOpen) {
      setBlocksOpen("both");
    }

    if (!isLeftBlockOpen && !isRightBlockOpen) {
      setBlocksOpen("none");
    }

    if (
      (!isLeftBlockOpen && isRightBlockOpen) ||
      (isLeftBlockOpen && !isRightBlockOpen)
    ) {
      setBlocksOpen("one");
    }
  }, [isLeftBlockOpen, isRightBlockOpen]);

  useEffect(() => {
    setPayStackComponentProps(prev => ({...prev, amount: value*100}))
  }, [value])

  useEffect(() => {
    if(apiReqs.data && apiReqs.isLoading){
      const { data } = apiReqs
      onDeposit({ requestBody: data })
    }
  }, [apiReqs])

  const onDeposit = async ({ requestBody }) => {
    try {
      const response = await postRequest({
        url: "/payment/deposit",
        data: requestBody
      });

      const { message, data, success } = response;

      alert(message)

      return setApiReqs({ isLoading: false, data: null, errorMsg: null })

    } catch (error) {
      console.error(error);

      return setApiReqs({ isLoading: false, data: null, errorMsg: error.message || 'Deposit error' })
    }
  };

  return (
    <div style={{ minHeight: "100vh" }} className="dashboard">
      <DashboardHeader />
      <div className="d-lg-flex d-md-flex d-block mt-lg-4 mt-md-4 mt-4 px-lg-4 px-md-4 px-4 align-items-start justify-content-between herogeneral">
        <div className="d-lg-none d-md-none d-flex align-items-center justify-content-between mb-4">
          <div className="col-lg-2">
            <CollapseBlock isSmallScreen={true} />
          </div>
          <div className="col-lg-2">
            <CollapseBlockRight isSmallScreen={true} />
          </div>
        </div>

        <div
          className={`${
            isLeftBlockOpen ? "col-lg-2 col-md-2" : "col-lg-1 col-md-1"
          } d-lg-flex d-md-flex d-none`}
        >
          <CollapseBlock setIsLeftBlockOpen={setIsLeftBlockOpen} />
        </div>

        <div
          className={`${
            blocksOpen == "both"
              ? "col-lg-8 col-md-8"
              : blocksOpen == "one"
              ? "col-lg-9 col-md-9"
              : blocksOpen == "none"
              ? "col-lg-10 col-md-10"
              : ""
          } col-auto px-lg-4 px-md-4 px-0`}
        >
          <h1 className="m-0 p-0 mb-3 font-weight-700 font-family-quantico txt-large txt-FFF">
            Deposit <span className="create-lobby-title-span">Money</span>
          </h1>
          <p className="m-0 p-0 mb-4 regular-txt font-weight-300 font-family-poppins txt-FFF">
            Enter Amount
          </p>

          {
            apiReqs.errorMsg &&
              <CustomErrorMsg errorMsg={apiReqs.errorMsg} verticalPadding={true} />
          }

          <PaystackConsumer {...payStackComponentProps}>
            {({ initializePayment }) => (
              // initializePayment(onSuccess, onClose)
              <AmountPicker
                loading={apiReqs.isLoading}
                btnTxt="Next"
                subTxt="Deposit money from 1k Upwards"
                btnFunc={() => initializePayment()}
                value={value}
                setValue={setValue}
              />              
            )}
          </PaystackConsumer>

        </div>

        <div
          className={`${
            isRightBlockOpen ? "col-lg-2 col-md-2" : "col-lg-1 col-md-1"
          } d-lg-flex d-md-flex d-none align-items-center justify-content-end`}
        >
          <div className="">
            <CollapseBlockRight setIsRightBlockOpen={setIsRightBlockOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import AutoInput from "../components/AutoInput";
import Select from "../components/Select";
import { statusOpt, typeOpt } from "../constants";
import SubmitButton from "../components/SubmitButton";
import { v4 } from "uuid";
import api from "./../utils/api";
import { useDispatch } from "react-redux";
import { createJob } from "../app/slices/jobSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //* Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = (e) => {
    e.preventDefault();
    //* formData oluştur
    const formData = new FormData(e.target);
    //* İnputlardaki verilerden bir nesne oluşturur.
    const newJobData = Object.fromEntries(formData.entries());
    //* Tarih ve id ekle
    newJobData.id = v4();
    newJobData.date = Date.now();
    //* Oluşturduğumuz veriyi api'ye kaydet.
    api
    //* Başarılı olursa
      .post("/jobs", newJobData)
      .then(() => {
        toast.success("İş Başarıyla Eklenildi")
        //* store'a veriyi kaydet.
        dispatch(createJob(newJobData));
        //* anasayfaya yönlendir.
        navigate("/");
      })
      //* Başarısız olursa
      .catch(() => toast.error("İş eklenirken bir sorun oluştu"));
  };

  return (
    <div className="add-page">
      <section className="container">
        <h2>Yeni İş Ekle</h2>

        <form onSubmit={handleSubmit}>
          <AutoInput label="Pozisyon" name="position" />
          <AutoInput label="Şirket" name="company" />
          <AutoInput label="Lokasyon" name="location" />

          <Select label={"Durum"} options={statusOpt} name="status" />
          <Select label={"Tür"} options={typeOpt} name="type" />

          <div>
            <SubmitButton type="submit" text="Oluştur" />
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddJob;

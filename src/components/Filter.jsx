import Select from "./Select";
import React, { useEffect, useState } from "react";
import { sortOpt, statusOpt, typeOpt } from "../constants/index";
import SubmitButton from "./SubmitButton";
import { useDispatch } from "react-redux";
import { setJobs, setLoading, setError } from "../app/slices/jobSlice";
import api from "../utils/api";

const Filter = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState();
  const [sort, setSort] = useState();
  const [status, setStatus] = useState();
  const [type, setType] = useState();
  const [debouncedText, setDebouncedText] = useState();

  useEffect(() => {
    if (text === undefined) return;
    //* Bir sayaç başlat ve işlemi sayaç durunca yap
    const timer = setTimeout(() => setDebouncedText(text), 2000);
    //* Eğer ki süre bitmeden tekrar useEffect çalışıyorsa(yeni sayaç başlaması) önceki sayacı iptal et
    return () => {
      clearTimeout(timer);
    };
  }, [text]);

  useEffect(() => {
    const sortParam =
      sort === "a-z" || sort === "z-a"
        ? "company"
        : sort === "En Yeni" || sort === "En Eski"
        ? "date"
        : undefined;

    const orderParam =
      sort === "a-z"
        ? "asc"
        : sort === "z-a"
        ? "desc"
        : sort === "En Yeni"
        ? "desc"
        : sort === "En Eski"
        ? "asc"
        : undefined;

        const params = {
          q: debouncedText || undefined,
          _sort: sortParam,
          _order: orderParam,
          type: type || undefined,
          status: status || undefined,
        };

    dispatch(setLoading());

    api
      .get("/jobs", { params })
      .then((res) => dispatch(setJobs(res.data)))
      .catch((err) => dispatch(setError(err.message)));
  }, [debouncedText, sort, type, status]);
  //* Formu sıfırla
  const handleReset = (e) => {
    e.preventDefault();
    //* stateleri sıfırla
    setText("")
    setDebouncedText("")
    setSort("")
    setStatus("")
    setType("")
    //* inputları sıfırla
    e.target.reset();
  }

  return (
    <div className="filter-sec">
      <h2>Filtreleme Formu</h2>

      <form onSubmit={handleReset}>
        <div>
          <label>Ara</label>
          <input type="text" onChange={(e) => setText(e.target.value)} />
        </div>

        <Select
          label={"Durum"}
          options={statusOpt}
          handleChange={(e) => setStatus(e.target.value)}
        />

        <Select
          label={"Tür"}
          options={typeOpt}
          handleChange={(e) => setType(e.target.value)}
        />

        <Select
          label={"Sırala"}
          options={sortOpt}
          handleChange={(e) => setSort(e.target.value)}
        />

        <div>
          <SubmitButton text={"Filtreleri Sıfırla"} />
        </div>
      </form>
    </div>
  );
};

export default Filter;

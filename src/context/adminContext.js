"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAppContext } from "./app";

const AdminContext = createContext();

export const useAdminContext = () => useContext(AdminContext);

export function AdminContextWrapper({ children }) {
  /**
   * open mobile actions
   *  */
  // admin filter
  const [openFilter, setOpenFilter] = useState(false);

  /**
   * unread orders
   */

  // open animation designed search in navbar
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [rerenderUnreads, setRerenderUnreads] = useState(0);
  // opened image
  const [openedImage, setOpenedImage] = useState("");
  // app context
  const { backendUrl, storeInfo } = useAppContext();

  const GetUnreadMessages = async () => {
    try {
      const unreadMsgs = await axios.get(backendUrl + "/api/v1/chats/unreads");

      setUnreadMessages(unreadMsgs?.data.length);
    } catch (error) {
      console.log("get unread messages error");
      console.log(error.response);
    }
  };
  useEffect(() => {
    GetUnreadMessages();
  }, [rerenderUnreads]);

  /**
   * get stats
   */

  const [stats, setStats] = useState([]);

  const [loading, setLoading] = useState(true);
  const today = new Date();

  // starting and ending date for daily orders
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 30);
  const [startDate, setStartDate] = useState(last30Days);
  const [endDate, setEndDate] = useState(today);

  const last30Month = new Date(today);
  last30Month.setMonth(today.getMonth() - 12);
  const [startMonth, setStartMonth] = useState(last30Month);
  const [endMonth, setEndMonth] = useState(today);

  useEffect(() => {
    const GetStats = async () => {
      try {
        const response = await axios.get(
          backendUrl +
            `/api/v1/admin/orders?startdate=${startDate}&enddate=${endDate}&startmonth=${startMonth}&endmonth=${endMonth}`
        );
        setStats(response.data.stats);
        setLoading(false);
      } catch (error) {
        console.log("get stats error");
        console.log(error.response);
      }
    };
    GetStats();
  }, [startDate, endDate, startMonth, endMonth]);

  /** Visitors statistics */
  const [visitStats, setVisitStats] = useState([]);
  const [startDateVisit, setStartDateVisit] = useState(last30Days);
  const [endDateVisit, setEndDateVisit] = useState(today);
  const [startMonthVisit, setStartMonthVisit] = useState(last30Month);
  const [endMonthVisit, setEndMonthVisit] = useState(today);

  useEffect(() => {
    const GetStats = async () => {
      try {
        const response = await axios.get(
          backendUrl +
            `/api/v1/admin/visitors?startdate=${startDateVisit}&enddate=${endDateVisit}&startmonth=${startMonthVisit}&endmonth=${endMonthVisit}&id=${storeInfo._id}`
        );
        setVisitStats(response.data.stats);
        setLoading(false);
      } catch (error) {
        console.log("get stats error");
        console.log(error.response);
      }
    };
    if (storeInfo._id) {
      GetStats();
    }
  }, [startDateVisit, endDateVisit, startMonthVisit, endMonthVisit, storeInfo]);

  return (
    <AdminContext.Provider
      value={{
        openFilter,
        setOpenFilter,
        unreadMessages,
        setRerenderUnreads,
        openedImage,
        setOpenedImage,
        stats,
        setStats,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        startMonth,
        setStartMonth,
        endMonth,
        setEndMonth,
        loading,
        visitStats,
        startDateVisit,
        setStartDateVisit,
        endDateVisit,
        setEndDateVisit,
        startMonthVisit,
        setStartMonthVisit,
        endMonthVisit,
        setEndMonthVisit,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

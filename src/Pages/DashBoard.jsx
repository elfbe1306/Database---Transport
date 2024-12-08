import React, { useEffect } from 'react'
import supabase from '../supabase-client'

export const DashBoard = () => {
  useEffect(() => {
    fetchWarehouse();
    functionGetWarehouse();
  }, [])

  const fetchWarehouse = async () => {
    const {data, error} = await supabase.from("warehouse").select("*");

    if(error) {
      console.log("Error fetching", error);
    } else {
      console.log(data);
    }
  }

  const functionGetWarehouse = async () => {
    const {data, error} = await supabase.rpc('Get_all_data_from_warehouse');

    if(error) {
      console.log("Error fetching", error);
    } else {
      console.log(data);
    }
  }

  return (
    <div>DashBoard</div>
  )
}

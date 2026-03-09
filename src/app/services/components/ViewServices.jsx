import React, { useEffect, useState } from 'react'
import Loading from '../../../../Loading'
import { get_api, post_api } from '@/app/api_helper/api_helper'
import { FaUserDoctor } from 'react-icons/fa6'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import Swal from 'sweetalert2'
import { RiRefreshLine } from 'react-icons/ri'

export default function ViewServices({ editId, setEditId, setActiveTab }) {

  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState([])

  const fetchAllServices = async () => {
    setLoading(true)
    try {
      const res = await get_api({
        params: null,
        path: 'service/view'
      })
      console.log(res)
      if (res.data.success) {
        setServices(res.data.response)
      }
      else {
        setServices([])
        alert('Services Data is Empty')
      }
      console.log(services)
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }



  useEffect(() => {
    fetchAllServices()
  }, [])

  const deleteService = async (id) => {
    setLoading(true)
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      })

      if (!result.isConfirmed) return

      const response = await post_api({
        body: {},
        params: id,
        path: 'service/delete'
      })

      if (response.data.success) {
        Swal.fire(
          'Deleted!',
          'Service Deleted Successfully.',
          'success'
        )
        fetchAllServices()
      } else {
        Swal.fire(
          'Something went wrong!',
          'Failed to delete Service!',
          'error'
        )
      }

    } catch (error) {
      console.log(error)

      Swal.fire(
        'Something went wrong!',
        'Failed to delete doctor!',
        'error'
      )
    }
    finally {
      setLoading(false)
    }
  }

  const editService = (id) => {
    try {
      setActiveTab('add')
      setEditId(id)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {loading && <Loading />}
      <div className="w-full bg-[#0D1D2D] min-h-screen p-8 text-white">
        <div className="max-w-[1320] mx-auto bg-[#13293D] p-8 rounded shadow-lg">

          <div className="flex items-center justify-between text-white">
            <h2 className="text-3xl  font-bold text-white mb-8">
              All Services
            </h2>
            <span onClick={() => fetchAllServices()} className="flex items-center gap-1 cursor-pointer hover:text-cyan-500 duration-100"><RiRefreshLine /> Refresh </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">

              <thead>
                <tr className="bg-[#0D1D2D] text-gray-300">
                  <th className="p-4">Image</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Short Description</th>
                  <th className="p-4">Full Details</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {services?.length > 0 ? (
                  services?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-[#1B3A57] transition"
                    >
                      <td className="p-4">
                        {item.service_image ? (
                          <img
                            src={item.service_image}
                            alt={item.name}
                            className="w-14 h-14 rounded-full object-cover border border-gray-600"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                            <FaUserDoctor />
                          </div>
                        )}
                      </td>

                      <td className="p-4 font-semibold">{item.service_name}</td>

                      <td className="p-4 text-gray-300">
                        {item.service_slug}
                      </td>

                      <td className="p-4">
                        {item.short_description} yrs
                      </td>

                      <td className="p-4">{item.full_details}</td>

                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => editService(item.id)} className="p-2 bg-yellow-500 rounded hover:bg-yellow-600 transition">
                            <FaEdit />
                          </button>
                          <button onClick={() => deleteService(item.id)} className="p-2 bg-red-600 rounded hover:bg-red-700 transition">
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-3xl font-bold  p-6 text-cyan-300 animate-pulse">
                      No Service Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

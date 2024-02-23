import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function EssayNotion() {

    const [name, setName] = useState('')
    const [division, setDivision] = useState(''); // '구분√' 값을 위한 상태
    const [priority, setPriority] = useState(''); // '순위√' 값을 위한 상태
    const [date, setDate] = useState(''); // '날짜' 값을 위한 상태
    const [important, setImportant] = useState(false); // '중요' 체크박스 값을 위한 상태
    const [urgent, setUrgent] = useState(false); // '긴급' 체크박스 값을 위한 상태
    const [mustDo, setMustDo] = useState(false); // 'Must-DO' 체크박스 값을 위한 상태
    const [inputCompleted, setInputCompleted] = useState(true); // '입력완료' 체크박스 값을 위한 상태

    const submitFormNotion = () => {
        console.log('we are in!' + name)
        axios('http://localhost:4000/api/pages', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                name: name,
                division: division,
                priority: priority,
                date: date,
                important: important,
                urgent: urgent,
                mustDo: mustDo,
                inputCompleted: inputCompleted
            })
        }).then(response => response.json())
            .then(data => {
                console.log('Success! ', data)
            }).catch((error) => {
                console.log('Error:', error)
            })
    }

    return (
        <div className="flex flex-col p-6 bg-gradient-to-r from-pink-100 to-blue-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-center text-pink-800">Submit to Notion</h1>
            <div className="w-96 mx-auto bg-white p-8 rounded shadow">
                <label className="block mb-2 font-bold text-gray-700" htmlFor="name">
                    Name
                </label>
                <input className="border w-full p-2 mb-4 rounded" type="text" id="name" onChange={(e) => setName(e.target.value)} />

                <label className="block mb-2 font-bold text-gray-700" htmlFor="division">
                    Division√
                </label>
                <input className="border w-full p-2 mb-4 rounded" type="text" id="division" onChange={(e) => setDivision(e.target.value)} />

                <label className="block mb-2 font-bold text-gray-700" htmlFor="priority">
                    Priority√
                </label>
                <input className="border w-full p-2 mb-4 rounded" type="text" id="priority" onChange={(e) => setPriority(e.target.value)} />

                <label className="block mb-2 font-bold text-gray-700" htmlFor="date">
                    Date
                </label>
                <input className="border w-full p-2 mb-4 rounded" type="date" id="date" onChange={(e) => setDate(e.target.value)} />

                <div className="flex items-center mb-4">
                    <input type="checkbox" id="important" onChange={(e) => setImportant(e.target.checked)} />
                    <label className="ml-2 text-gray-700" htmlFor="important">
                        Important
                    </label>
                </div>

                <div className="flex items-center mb-4">
                    <input type="checkbox" id="urgent" onChange={(e) => setUrgent(e.target.checked)} />
                    <label className="ml-2 text-gray-700" htmlFor="urgent">
                        Urgent
                    </label>
                </div>

                <div className="flex items-center mb-4">
                    <input type="checkbox" id="mustDo" onChange={(e) => setMustDo(e.target.checked)} />
                    <label className="ml-2 text-gray-700" htmlFor="mustDo">
                        Must-DO
                    </label>
                </div>

                <div className="flex items-center mb-4">
                    <input type="checkbox" id="inputCompleted" onChange={(e) => setInputCompleted(e.target.checked)} checked={true} />
                    <label className="ml-2 text-gray-700" htmlFor="inputCompleted">
                        Input Completed
                    </label>
                </div>

                <button className="py-2 px-4 bg-pink-500 text-white rounded hover:bg-pink-600" onClick={submitFormNotion}>
                    Submit to Notion
                </button>
            </div>
        </div>
    )
}
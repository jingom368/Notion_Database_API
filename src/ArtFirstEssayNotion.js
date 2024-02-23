import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from "react-select";

export default function ArtFirstEssayNotion() {

    const participantsList = [
        { value: "금지윤", label: "금지윤", color: '#FACDCD' },
        { value: "이주희", label: "이주희", color: '#FACDCD' },
        { value: "김보민", label: "김보민", color: '#FFEBCC' },
        { value: "장아연", label: "장아연", color: '#FFEBCC' },
        { value: "김세인", label: "김세인", color: '#FFF7CC' },
        { value: "장진웅", label: "장진웅", color: '#FFF7CC' },
        { value: "김수진", label: "김수진", color: '#C6ECD4' },
        { value: "최예솔", label: "최예솔", color: '#C6ECD4' },
        { value: "박민주", label: "박민주", color: '#C9D8F0' },
        { value: "한수현", label: "한수현", color: '#C9D8F0' },
        { value: "유지희", label: "유지희", color: '#FFCCE5' },
        { value: "홍경표", label: "홍경표", color: '#FFCCE5' },
        { value: "이유경", label: "이유경", color: '#EECCE5' }
    ];

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('');
    const [meeting, setMeeting] = useState('');
    const [week, setWeek] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [inputCompleted, setInputCompleted] = useState(true);
    const [category, setCategory] = useState('');
    const [participants, setParticipants] = useState([]);
    const [fileUrl, setFileUrl] = useState(null);

    const handleChange = (selectedOptions) => {
        setParticipants(selectedOptions);
    };

    useEffect(() => {
        setDate(new Date().toISOString().split('T')[0]);
    }, []);

    const [pdf, setPdf] = useState(null);

    // 파일 업로드 핸들러
    const handleFileUpload = (e) => {
        setPdf(e.target.files[0]);
    }

    const submitFormNotion = async () => {

        // 파일 선택 여부 확인
        if (!pdf) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', pdf);


        try {
            const uploadResponse = await axios.post('http://localhost:4000/upload', formData)
            console.log('Success! ', uploadResponse.data);
            console.log('File URL: ', uploadResponse.data.link); // 이 부분을 확인하세요.
            alert(`File uploaded: ${uploadResponse.data.title}\nLocation: ${uploadResponse.data.link}`);
            setFileUrl(uploadResponse.data.link); // 파일 URL 저장

            // 참여자 데이터를 문자열 형태로 변환합니다.
            const transformedParticipants = participants.map(participant => participant.label);

            // Notion 페이지 생성 요청을 보내기 전에 파일 URL이 설정되었는지 확인합니다.
            if (!fileUrl) {
                alert('File upload is not completed yet.');
                return;
            }

            const data = {
                title,
                author,
                meeting,
                week,
                date,
                inputCompleted,
                category,
                participants: transformedParticipants,
                files: uploadResponse.data.link // 업로드 결과로 받은 URL을 직접 사용합니다.
            };

            const pageResponse = await axios('http://localhost:4000/api/pages', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data)
            });
            console.log('Success! ', pageResponse.data);

        } catch (error) {
            console.log('Error:', error);
            alert('File upload failed.');
        }

    }

    // 참여자 선택 핸들러
    const handleParticipantsChange = (e) => {
        let value = Array.from(e.target.selectedOptions, option => option.value);
        setParticipants(value);
    }

    return (
        <div className="flex flex-col p-auto bg-gradient-to-r from-pink-100 to-blue-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-center text-pink-800">Submit to Notion</h1>
            <div className="w-96 mx-auto bg-white p-8 rounded shadow">
                <label className="block mb-2 font-bold text-gray-700" htmlFor="title">
                    제목
                </label>
                <input className="border w-full p-2 mb-4 rounded" type="text" id="title" onChange={(e) => setTitle(e.target.value)} />

                <label className="block mb-2 font-bold text-gray-700" htmlFor="author">
                    작가님
                </label>
                <select className="border w-full p-2 mb-4 rounded" id="author" onChange={(e) => setAuthor(e.target.value)}>
                    <option value="">작가 선택</option>
                    <option value="금지윤">금지윤</option>
                    <option value="김보민">김보민</option>
                    <option value="김세인">김세인</option>
                    <option value="김수진">김수진</option>
                    <option value="박민주">박민주</option>
                    <option value="유지희">유지희</option>
                    <option value="이유경">이유경</option>
                    <option value="이주희">이주희</option>
                    <option value="장아연">장아연</option>
                    <option value="장진웅">장진웅</option>
                    <option value="최예솔">최예솔</option>
                    <option value="한수현">한수현</option>
                    <option value="홍경표">홍경표</option>
                </select>

                <label className="block mb-2 font-bold text-gray-700" htmlFor="meeting">
                    n모임 선택
                </label>
                <select className="border w-full p-2 mb-4 rounded" id="meeting" onChange={(e) => setMeeting(e.target.value)}>
                    <option value="">모임 선택</option>
                    <option value="후속 모임 ★1">후속 모임 ★1</option>
                    <option value="with 문정 작가님">with 문정 작가님</option>
                </select>

                <label className="block mb-2 font-bold text-gray-700" htmlFor="week">
                    n주차 선택
                </label>
                <select className="border w-full p-2 mb-4 rounded" id="week" onChange={(e) => setWeek(e.target.value)}>
                    <option value="">주차 선택</option>
                    <option value="1주차">1주차</option>
                    <option value="2주차">2주차</option>
                    <option value="3주차">3주차</option>
                    <option value="4주차">4주차</option>
                    <option value="5주차">5주차</option>
                    <option value="6주차">6주차</option>
                    <option value="7주차">7주차</option>
                    <option value="8주차">8주차</option>
                    <option value="9주차">9주차</option>
                </select>

                <label className="block mb-2 font-bold text-gray-700" htmlFor="date">
                    날짜
                </label>
                <input className="border w-full p-2 mb-4 rounded" type="date" id="date" onChange={(e) => setDate(e.target.value)} value={date} />

                <label className="block mb-2 font-bold text-gray-700" htmlFor="file">
                    파일
                </label>
                <input className="border w-full p-2 mb-4 rounded" type="file" id="file" onChange={handleFileUpload} />

                <div className="flex items-center mb-4">
                    <input type="checkbox" id="inputCompleted" onChange={(e) => setInputCompleted(e.target.checked)} checked={true} />
                    <label className="ml-2 text-gray-700" htmlFor="inputCompleted">
                        입력 완료
                    </label>
                </div>

                <label className="block mb-2 font-bold text-gray-700" htmlFor="category">
                    카테고리
                </label>
                <select className="border w-full p-2 mb-4 rounded" id="category" onChange={(e) => setCategory(e.target.value)}>
                    <option value="">카테고리 선택</option>
                    <option value="에세이">에세이</option>
                    <option value="추억">추억</option>
                </select>

                <div>
                    <label className="block mb-2 font-bold text-gray-700" htmlFor="participants">
                        참여
                    </label>
                    <Select
                        id="participants"
                        options={participantsList}
                        isMulti
                        onChange={handleChange}
                        value={participants}
                        getOptionValue={option => option.value}
                        getOptionLabel={option => option.label}
                        theme={theme => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                // 선택된 항목의 배경색을 지정합니다.
                                primary25: 'powderblue', // 파스텔 톤의 색상으로 변경
                                primary: 'skyblue', // 파스텔 톤의 색상으로 변경
                            },
                        })}
                        styles={{
                            multiValue: (styles, { data }) => {
                                return {
                                    ...styles,
                                    backgroundColor: data.color,
                                };
                            },
                            multiValueLabel: (styles, { data }) => ({
                                ...styles,
                                color: 'black',
                            }),
                        }}
                    />
                </div>

                <button className="mt-8 py-2 px-4 bg-pink-500 text-white rounded hover:bg-pink-600" onClick={submitFormNotion}>
                    Submit to Notion
                </button>
            </div>
        </div>
    )
}
import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './Messages.css';
import { UserMessage } from '../../components/Message/UserBlock/User';
import { wsSend, wsGet } from '../../controllers/websocket';
import { MyMessage } from '../../components/Message/Messages/MyMessage/MyMessage';
import { EnemyMessage } from '../../components/Message/Messages/EnemyMessage/EnemyMessage';
import { CMessages } from '../../containers/Messages/CMessages';
import { Search } from '../../components/Message/Search/Search';
import { Header } from '../../components/Message/HeaderMessage/Header';
import { Input } from '../../components/Message/InputMessage/Input';
import { useEffect } from 'react';
import { Loader } from '../../components/UI/Loader/Loader';
import { URL_API } from '../../CONSTS';

export const Messages = () => {
    const history = useHistory();
    const user_id = localStorage.getItem('user_id');
    const messagesScroll = useRef<null | HTMLDivElement>(null);
    const [values, setValues] = useState<IMessage>({
        author: user_id,
        from: window.location.search.includes('?user_id=')
            ? Number(window.location.search.split('?')[2].replace('user_id=', ''))
            : 0,
        text: '',
        room_id: window.location.search.includes('?message_room=')
            ? Number(window.location.search.split('?')[1].replace('message_room=', ''))
            : 0,
        date: new Date().toLocaleString(),
    });

    const [info, setInfo] = useState({
        author: user_id,
        from: window.location.search.includes('?user_id=')
            ? Number(window.location.search.split('?')[2].replace('user_id=', ''))
            : 0,
        room_id: window.location.search.includes('?message_room=')
            ? Number(window.location.search.split('?')[1].replace('message_room=', ''))
            : 0,
    });

    const [rooms, setRooms] = useState<IRooms>({
        message: '',
        rooms: [
            {
                message_room_enemy: 0,
                message_room_id: 0,
                message_room_owner: 0,
                user_avatar: '',
                user_date_register: '',
                user_email: '',
                user_id: 0,
                user_name: '',
                user_phone: '',
                user_place: '',
                user_surname: '',
            },
        ],
    });
    const [filterRoom, setFilterRoom] = useState<null | any[]>(null);
    const [selected, setSelected] = useState<any>({});
    const [loading, setLoading] = useState(true);

    const [messages, setMessages] = useState<any[]>([]);

    wsGet(messages, setMessages);

    useEffect(() => {
        if (window.location.search.includes('?message_room=')) {
            wsSend(info);
        }

        fetch(`${URL_API}/chat/rooms`, {
            method: 'POST',
            body: JSON.stringify({ ...info }),
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setRooms(res);
                setLoading(false);
            });

        fetch(`${URL_API}/chat/get-messages`, {
            method: 'POST',
            body: JSON.stringify({ ...info }),
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res: IMessages) => {
                setMessages([...messages, ...res.messages]);
            });
    }, []);

    // TODO: попробовать заменить на функцию которая вызывается при загрузке
    useEffect(() => {
        const heightScroll = messagesScroll.current?.scrollHeight;
        if (heightScroll) {
            messagesScroll.current?.scrollTo(0, heightScroll);
        }
        const check = rooms.rooms.filter((c) => {
            if (window.location.search.includes('?message_room=')) {
                return (
                    c.message_room_id ===
                    Number(window.location.search.split('?')[1].replace('message_room=', ''))
                );
            }
        });

        setSelected(check[0]);
    });

    function changeEnemyMessages(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (
            window.location.search.includes('?user_id=') &&
            window.location.search.includes('?message_room=')
        ) {
            setInfo({
                ...info,
                from: Number(window.location.search.split('?')[2].replace('user_id=', '')),
                room_id: Number(window.location.search.split('?')[1].replace('message_room=', '')),
            });
        }
    }

    function changeInput(e: React.ChangeEvent<HTMLInputElement>) {
        setValues({ ...values, text: e.target.value });
    }

    function sendMessage(values: IMessage) {
        wsSend(values);
        setValues({ ...values, text: '' });
    }

    function searchHandler(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.value.trim() !== '') {
            const values = e.target.value.includes(' ')
                ? e.target.value.split(' ')
                : [e.target.value.trim()];
            const filteredRooms = rooms.rooms.filter(
                (r) =>
                    r.user_name.includes(values[0]) &&
                    r.user_surname.includes(values[1] ? values[1] : ''),
            );

            setFilterRoom(values[2] ? [] : filteredRooms);
        } else {
            setFilterRoom(null);
        }
    }

    const mapUsersRooms = rooms.rooms.map((u) => {
        return (
            <UserMessage
                name={u.user_name}
                surname={u.user_surname}
                avatar={u.user_avatar}
                id={u.user_id}
                message_room={u.message_room_id}
                key={u.user_id}
                change={changeEnemyMessages}
            />
        );
    });

    const mapMessages = messages.map((c) => {
        if (String(c.message_author) === user_id) {
            return (
                <MyMessage
                    date={c.message_date}
                    key={c.message_id ? c.message_id : Math.random()}
                    text={c.message_text || c.data.text}
                />
            );
        } else {
            return (
                <EnemyMessage
                    date={c.message_date}
                    key={c.message_id ? c.message_id : Math.random()}
                    text={c.message_text || c.data.text}
                />
            );
        }
    });

    const mapFilterRooms = filterRoom?.map((u) => {
        return (
            <UserMessage
                name={u.user_name}
                surname={u.user_surname}
                avatar={u.user_avatar}
                id={u.user_id}
                message_room={u.message_room_id}
                key={u.user_id}
                change={changeEnemyMessages}
            />
        );
    });

    if (loading) return <Loader />;

    return (
        <CMessages>
            <div className="messages-left-side">
                <Search search={searchHandler} />
                <div className="messages-left-side-messages">
                    {rooms.rooms.length ? (
                        filterRoom === null ? (
                            mapUsersRooms
                        ) : filterRoom?.length ? (
                            mapFilterRooms
                        ) : (
                            <div className="message-left-side-no-rooms">
                                По вашему запросу ничего не найдено
                            </div>
                        )
                    ) : (
                        <div className="message-left-side-no-rooms">Нет комнат для сообщений</div>
                    )}
                </div>
            </div>
            <div className="messages-right-side">
                {selected ? (
                    <>
                        <Header user={selected} />
                        <div className="messages-messages" ref={messagesScroll}>
                            {mapMessages}
                        </div>
                        <Input
                            value={values.text}
                            change={(e: React.ChangeEvent<HTMLInputElement>) => changeInput(e)}
                            click={() => sendMessage(values)}
                        />
                    </>
                ) : !window.location.search.replace('?message_room=', '') && !selected ? (
                    <div className="messages-right-side-no-room">
                        Выберите с кем хотите начать общение
                    </div>
                ) : (
                    <>{history.push('/messages')}</>
                )}
            </div>
        </CMessages>
    );
};

interface IMessage {
    author: string | null;
    from: number;
    text: string;
    room_id: number;
    date: string;
}

interface IRooms {
    message: string;
    rooms: IRoom[];
}

interface IRoom {
    message_room_enemy: number;
    message_room_id: number;
    message_room_owner: number;
    user_avatar: string;
    user_date_register: string;
    user_email: string;
    user_id: number;
    user_name: string;
    user_phone: null | string;
    user_place: null | string;
    user_surname: string;
}

interface IMessages {
    message: string;
    messages: IMessageResponse[];
}

interface IMessageResponse {
    message_author: number;
    message_from: number;
    message_id: number;
    message_text: string;
}

import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import {setRooms, setOrderStatuses, addOrder} from "./reducerSlice";
import authHeader from "../services/auth-header";
import Card from "react-bootstrap/Card";


const Component = () => {
    let {id} = useParams();
    const apiBase = useSelector((state) => state.toolkit.apiBase);
    const rooms = useSelector((state) => state.toolkit.rooms);
    const orderStatuses = useSelector((state) => state.toolkit.orderStatuses);
    const [selected, setSelected] = useState([]);
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.toolkit.isLoggedIn);


    useEffect(() => {
        axios.get(`${apiBase}/rooms/?hotel_id=${encodeURIComponent(id)}`, {headers: authHeader()}).then((resp) => {
            dispatch(setRooms(resp.data));
        });

        axios
            .get(`${apiBase}/orders/info/statuses`, {headers: authHeader()})
            .then((resp) => {
                dispatch(setOrderStatuses(resp.data));
            });
    }, [apiBase, dispatch]);


    const addCart = (s) => {
        const status = orderStatuses.find((x) => x.name === "В корзине").val;
            axios.post(
                    `${apiBase}/orders`,
                    {
                        status: +status,
                        hotel_id: +id,
                        room_id: +s,
                        user_id: +user.id,
                    },
                    { headers: authHeader() }
                )
                .then((resp) => {
                    dispatch(addOrder(resp.data));
                });
    };

    return (
        <>
            <h1>Номера <Button variant="outline-secondary" as={Link} to={`/`}>
                На предыдущую страницу</Button></h1>

            <hr/>
            <div className='Row'>
                <Row xs={1} md={3} className="g-4">
                    {rooms &&
                        rooms.map((x) => (
                            <Col>
                                <Card style={{height: '100%', padding: 10}}>
                                    <Card.Img style={{height: 300}} variant="top" src={x.image}/>
                                    <Card.Body>
                                        <Card.Title style={{textAlign: `center`}}><p style={{fontSize: 25}}>{x.category}
                                        </p></Card.Title>

                                        <Card.Text style={{textAlign: `center`}}>
                                            Вместительность: {x.max_count} чел.
                                            <p>Стоимость: {x.price} руб/сутки</p>
                                        </Card.Text>
                                        <Card.Text style={{textAlign: `justify`}}>
                                            {x.description}
                                        </Card.Text>
                                        <Card.Text style={{textAlign: `center`}}>
                                            {isLoggedIn && (
                                            <Button
                                                key={x.id}
                                                variant="outline-primary"
                                                className="m-1"
                                                onClick={() => {addCart(x.id)}}
                                            >
                                                Забронировать номер
                                            </Button>)}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}

                </Row>


                {!rooms.length && (
                    <>
                        <Card style={{height: '100%', padding: 10}}>

                            <Card.Body>

                                <Card.Text style={{textAlign: `center`}}>
                                    <h4>Свободных номеров нет :(</h4></Card.Text>
                            </Card.Body>
                        </Card>

                    </>
                )}
            </div>


        </>
    );
};

export default Component;

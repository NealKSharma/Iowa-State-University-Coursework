import 'bootstrap/dist/css/bootstrap.css';
import { Container, Card } from 'react-bootstrap';

export function UserCard(props) {
    return (
        <Container className="p-4">
            <Card style={{ width: "15rem" }}>
                <Card.Img variant="top" src={props.picture} />
                <Card.Body>
                    <Card.Title>{props.name}</Card.Title>
                    <Card.Text>Salary 💲{props.amount}</Card.Text>
                    <Card.Text>{props.married ? "Married" : "Single"}</Card.Text>
                    <ul>
                        <li>: {props.address.street}</li>
                        <li>{props.address.city}, {props.address.state}</li>
                    </ul>
                </Card.Body>
            </Card>
        </Container>
    );
}
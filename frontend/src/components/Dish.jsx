import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
 
import Star from './Star'
import Currency from './Currency'
import './Custom.css'

function Dish({ data }) {
    return (
        <>
            {data.map((item) => (
                <Link to={"dish/" + item.id} key={item.id} className='text-decoration-none'>
                    <Card className='border border-0 cardHover' style={{ width: '16rem', height: '320px' }}>
                        <Card.Img className='object-fit-cover' variant='top' src={item.image} style={{height: '175px'}}/>
                        <Card.Body>
                            <Card.Title>
                                {item.name}
                            </Card.Title>
                            <Card.Text>
                                <span className="d-flex">
                                    <Star st={item.rating} />
                                    <span className='ms-2 text-secondary'>{item.rating}/5</span>
                                    {
                                        item.status == 'còn hàng' ? (
                                            <span></span>
                                        )
                                        : (
                                            <span className='ms-3 px-2 py-1 bg-danger rounded-pill text-white' style={{fontSize: '12px'}}>
                                                Tạm ngưng
                                            </span>
                                        )
                                    }   
                                </span>
                                <span className='my-1 text-secondary d-block' style={{fontSize: '14px'}}>Đã bán {item.sold}</span>
                                <Currency amount={item.price} />
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            ))}
        </>
    )
}

export default Dish
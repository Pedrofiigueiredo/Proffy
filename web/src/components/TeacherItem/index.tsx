import React from 'react';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg'

import './styles.css';

interface TeacherItemProps {
    name: string;
    image: string;
    subject: string;
    description: string;
    price: string;
}

const TeacherItem: React.FC<TeacherItemProps> = (props) => {
  return (
    <article className="teacher-item">
    <header>
        <img src={props.image} alt="Diego Fernandes"/>
        <div>
            <strong>{props.name}</strong>
            <span>{props.subject}</span>
        </div>
    </header>

    <p>{props.description}</p>

    <footer>
        <p>
            Preço/hora
            <strong>{props.price}</strong>
        </p>

        <button type="button">
            <img src={whatsappIcon} alt="WhatsApp"/>Entrar em contato
        </button>
    </footer>
</article>
  );
}

export default TeacherItem;
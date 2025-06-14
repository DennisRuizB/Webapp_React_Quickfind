import React, { useState } from "react";
import ChatWindow from "../../ChatWindow/ChatWindow";
import styles from "./ChatDisplay.module.css";

interface Company {
  _id: string;
  name: string;
  description: string;
  location: string;
  email: string;
  phone: string;
}

interface ChatDisplaysProps {
  companies: Company[];
  companyId: string;
}

const ChatDisplays: React.FC<ChatDisplaysProps> = ({ companies, companyId }) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  return (
    <div className={styles.chatDisplaysContainer}>
      {!selectedCompany ? (
        <table className={styles.companiesTable}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr
                key={company._id}
                onClick={() => setSelectedCompany(company)}
              >
                <td>{company._id}</td>
                <td>{company.name}</td>
                <td>{company.email}</td>
                <td>{company.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <button className={styles.backButton} onClick={() => setSelectedCompany(null)}>
            ← Volver
          </button>
          <ChatWindow
            companyId={companyId}
            companyName={selectedCompany.name}
            userId={selectedCompany._id}
            senderId ={companyId}
            receiverId={selectedCompany._id}
          />
        </>
      )}
    </div>
  );
};

export default ChatDisplays;
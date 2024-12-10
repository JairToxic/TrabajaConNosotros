.container {
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom right, #4a00e0, #8e2de2);
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header h1 {
  text-align: center;
  font-size: 2.5rem;
}

.header span {
  color: #ffe600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image {
  width: 100%;
  height: 300px;
  background: url('/path/to/your/image.jpg') no-repeat center center/cover;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  animation: scaleIn 1.2s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}

.right {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.requisitos,
.ofrecemos {
  margin-bottom: 20px;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  font-size: 1.2rem;
  margin-bottom: 5px;
  position: relative;
  padding-left: 20px;
}

li::before {
  content: '✔';
  position: absolute;
  left: 0;
  color: #ffe600;
  font-size: 1.2rem;
}

.button {
  align-self: center;
  background: #ffe600;
  color: #4a00e0;
  padding: 10px 20px;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.button:hover {
  background: #ffcc00;
  transform: scale(1.05);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.4);
}

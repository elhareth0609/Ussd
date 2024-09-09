import serial.tools.list_ports

def list_com_ports():
    ports = serial.tools.list_ports.comports()
    com_ports = []

    for port in ports:
        com_ports.append(port.device)  # Get the COM port

    if com_ports:
        print("Available COM Ports:")
        for com_port in com_ports:
            print(com_port)
    else:
        print("No COM ports found.")

if __name__ == "__main__":
    list_com_ports()

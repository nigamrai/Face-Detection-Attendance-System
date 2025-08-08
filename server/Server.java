import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class Server {
    public static void main(String[] args) {
        
        int port = 80;

        try (ServerSocket ss = new ServerSocket(port)) {
            while(true){
 Socket socket = ss.accept();
                System.out.println("Client connected: " + socket.getInetAddress());

                ClientHandler clientHandler = new ClientHandler(socket);
                Thread thread = new Thread(clientHandler);  
                thread.start();

                // Close the socket
                socket.close();
            }
           

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class ClientHandler implements Runnable {
        private Socket socket;
        public ClientHandler(Socket socket) {
            this.socket = socket;
        }     
          public void run() {
            try {
                  BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
            writer.write("Hello Client!\n");
            writer.flush();

            // InputStream to read the server's response
            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));

            // Read and print response
            String responseLine;
            while ((responseLine = reader.readLine()) != null) {
                System.out.println(responseLine);
            }  

            }catch (Exception e) {
                e.printStackTrace();
            } finally {
                try {
                    socket.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
          }
}  

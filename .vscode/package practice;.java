package practice;

class Node {
    int data;
    Node next;
    Node prev;

    Node(int data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

public class Dsa11 {

    private Node head;
    private Node tail;

    // Insert at beginning
    public void insertAtBeginning(int data) {
        Node newNode = new Node(data);

        if (head == null) {
            head = tail = newNode;
        } else {
            newNode.next = head;
            head.prev = newNode;
            head = newNode;
        }
        System.out.println(data + " inserted at beginning.");
    }

    // Insert at end
    public void insertAtEnd(int data) {
        Node newNode = new Node(data);

        if (head == null) {
            head = tail = newNode;
        } else {
            tail.next = newNode;
            newNode.prev = tail;   // IMPORTANT FIX
            tail = newNode;
        }
        System.out.println(data + " inserted at end.");
    }

    // Delete a node by value
    public void delete(int data) {
        if (head == null) {
            System.out.println("List is empty. Cannot delete.");
            return;
        }

        Node current = head;

        while (current != null && current.data != data) {
            current = current.next;
        }

        if (current == null) {
            System.out.println(data + " not found in list.");
            return;
        }

        // Case 1: Deleting head
        if (current == head) {
            head = head.next;
            if (head != null) head.prev = null;
        }

        // Case 2: Deleting tail
        else if (current == tail) {
            tail = tail.prev;
            if (tail != null) tail.next = null;
        }

        // Case 3: Middle node
        else {
            current.prev.next = current.next;
            current.next.prev = current.prev;
        }

        System.out.println(data + " deleted from list.");
    }

    // Display forward
    public void displayForward() {
        if (head == null) {
            System.out.println("List is empty.");
            return;
        }

        Node temp = head;
        System.out.print("Forward: ");
        while (temp != null) {
            System.out.print(temp.data + " <-> ");
            temp = temp.next;
        }
        System.out.println("null");
    }

    // Display reverse
    public void displayReverse() {
        if (tail == null) {
            System.out.println("List is empty.");
            return;
        }

        Node temp = tail;
        System.out.print("Reverse: ");
        while (temp != null) {
            System.out.print(temp.data + " <-> ");
            temp = temp.prev;
        }
        System.out.println("null");
    }

    // Main method to test
    public static void main(String[] args) {
        Dsa11 list = new Dsa11();

        list.insertAtBeginning(30);
        list.insertAtBeginning(20);
        list.insertAtBeginning(10);

        list.insertAtEnd(40);
        list.insertAtEnd(50);

        list.displayForward();
        list.displayReverse();

        list.delete(10);
        list.delete(40);

        list.displayForward();
        list.displayReverse();
    }
}

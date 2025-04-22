public class test {
    String s1 = sM1("a");
    String s2 = sM1("c");

    public test() {
        s1 = sM1("1");
        s1 = sM1("3");
    }

    String s3 = sM1("2");
    String s4 = sM1("4");

    private String sM1(String s) {
        System.out.println(s);
        System.out.print(s1.concat(s));
        return s;
    }

    public static void main(String[] args) {
        test it = new test();
    }
}

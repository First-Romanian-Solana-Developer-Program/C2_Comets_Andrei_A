fn main() {
    // TODO: Create an array called `a` with at least 100 elements in it.
    let a = ["item"; 101];
    

    if a.len() >= 100 {
        println!("Wow, that's a big array!");
        println!("{:#?}", a)
    } else {
        println!("Meh, I eat arrays like that for breakfast.");
        panic!("Array not big enough, more elements needed");
    }
}

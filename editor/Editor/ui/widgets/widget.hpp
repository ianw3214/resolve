#pragma once

#include <string>
#include <functional>
#include <vector>

class Widget {
public:
    // This is where other widgets will specify how they work
    // TODO: Probably want a better name for this
    virtual void define() {}
protected:
    Widget(const std::string& name, int x, int y);
    virtual ~Widget();
    
    struct Rect {
        int x;
        int y;
        int w;
        int h;
    };

    // Functions that help define the widget
    void add_h_padding(int padding);
    void add_v_padding(int padding);
    void new_line();
    // TODO: Specify text draw size
    void draw_text(const std::string& text, bool newline = true);
    void draw_text_ref(std::string * ref, bool newline = true);
    void draw_image(const std::string& tex, int w, int h);
    void draw_image(const std::string& tex, int w, int h, std::function<void()> f);
    void draw_image(const std::string& tex, int w, int h, const Rect& src);
    void draw_image(const std::string& tex, int w, int h, const Rect& src, std::function<void()> f);

    enum class ComponentType {
        TEXT,
        TEXT_REFERENCE,
        IMAGE
    };

    struct Component {
        Component(ComponentType type, int x, int y) : type(type), x_offset(x), y_offset(y) {}
        virtual ~Component() {}
        ComponentType type;

        // The offsets that determine where to
        int x_offset;
        int y_offset;
    };

    struct TextComponent : public Component {
        TextComponent(const std::string& text, bool newline, int x, int y) 
            : text(text), newline(newline), Component(ComponentType::TEXT, x, y) {}
        std::string text;
        bool newline;
    };

    struct TextReferenceComponent : public Component {
        TextReferenceComponent(std::string * ref, bool newline, int x, int y) 
            : reference(ref), newline(newline), Component(ComponentType::TEXT_REFERENCE, x, y) {}
        std::string * reference;
        bool newline;
    };

    struct ImageComponent : public Component {
        ImageComponent(const std::string& tex, int w, int h, int x, int y)
            : texture(tex), w(w), h(h), use_full_image(true), Component(ComponentType::IMAGE, x, y) {} 
        ImageComponent(const std::string& tex, int w, int h, const Rect& src, int x, int y) 
            : texture(tex), w(w), h(h), use_full_image(false), source(src), Component(ComponentType::IMAGE, x, y) {}
        std::string texture;
        int w;
        int h;
        bool use_full_image;
        Rect source;
    };

    std::vector<Component*> render_parts;

    struct ClickData {
        Rect area;
        std::function<void()> callback;
    };

    std::vector<ClickData> click_parts;

public:
    bool click(int mouse_x, int mouse_y);   // Returns true if the widget was clicked
    void render();
private:
    std::string name;

    // The position of the widget
    int x;
    int y;

    // The draw position of the widget
    int draw_x;
    int draw_y;
};
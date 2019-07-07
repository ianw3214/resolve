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
        Component(ComponentType type) : type(type) {}
        virtual ~Component() {}
        ComponentType type;

        // The offsets that determine where to
        int offset_x;
        int offset_y;
    };

    struct TextComponent : public Component {
        TextComponent(const std::string& text, bool newline) 
            : text(text), newline(newline), Component(ComponentType::TEXT) {}
        std::string text;
        bool newline;
    };

    struct TextReferenceComponent : public Component {
        TextReferenceComponent(std::string * ref, bool newline) 
            : reference(ref), newline(newline), Component(ComponentType::TEXT_REFERENCE) {}
        std::string * reference;
        bool newline;
    };

    struct ImageComponent : public Component {
        ImageComponent(const std::string& tex, int w, int h)
            : texture(tex), w(w), h(h), use_full_image(true), Component(ComponentType::IMAGE) {} 
        ImageComponent(const std::string& tex, int w, int h, const Rect& src) 
            : texture(tex), w(w), h(h), use_full_image(false), source(src), Component(ComponentType::IMAGE) {}
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
    
    // This should only be used by the widget manager
    void resetDrawPos();
private:
    std::string name;

    // The position of the widget
    int x;
    int y;

    // The draw position of the widget
    int draw_x;
    int draw_y;
};
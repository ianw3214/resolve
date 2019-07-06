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
    void draw_text(const std::string& text);
    void draw_image(std::string& tex, int w, int h, const Rect& src);
    void draw_image(std::string& tex, int w, int h, const Rect& src, std::function<void()> f);

    enum class ComponentType {
        TEXT,
        IMAGE
    };

    struct Component {
        Component(ComponentType type) : type(type) {}
        virtual ~Component() {}
        ComponentType type;
    };

    struct TextComponent : public Component {
        TextComponent(const std::string& text) : text(text), Component(ComponentType::TEXT) {}
        std::string text;
    };

    struct ImageComponent : public Component {
        ImageComponent(const std::string& tex, int w, int h, const Rect& src) 
            : texture(tex), w(w), h(h), source(src), Component(ComponentType::IMAGE) {}
        std::string texture;
        int w;
        int h;
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
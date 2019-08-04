#pragma once

#include <string>
#include <functional>
#include <vector>

class Widget {
public:
    // This is where other widgets will specify how they work
    // TODO: Probably want a better name for this
    virtual void define() {}
    // Calculates dimensions of the widget based on the definition
    void calculate_dim();

    // Some widgets will be updated every frame, others will not
    void set_update(bool update) { m_update = update; }

    // Enumeration for where to anchor the widget
    enum class Anchor {
        TOP_LEFT,
        TOP_RIGHT,
        BOTTOM_LEFT,
        BOTTOM_RIGHT
    };
    Anchor get_anchor_type() const { return anchor; }

    static const int text_padding = 4;
    enum class TextSize {
        SMALL = 16,
        MEDIUM = 32,
        LARGE = 64
    };
    int get_text_width(TextSize size) {
        if (size == TextSize::SMALL) return 10;
        if (size == TextSize::MEDIUM) return 20;
        if (size == TextSize::LARGE) return 36;
        return 0;
    }
protected:
    Widget(const std::string& name, Anchor anchor = Anchor::TOP_LEFT);
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
    void new_line(TextSize size = TextSize::MEDIUM);
    void draw_text(const std::string& text, TextSize size = TextSize::MEDIUM, bool newline = true);
    void draw_text(const std::string& text, std::function<void()> f, TextSize size = TextSize::MEDIUM, bool newline = true);
    void draw_text_ref(std::string * ref, TextSize size = TextSize::MEDIUM, bool newline = true);
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
        TextComponent(const std::string& text, bool newline, int x, int y, TextSize size) 
            : text(text), size(size), newline(newline), Component(ComponentType::TEXT, x, y) {}
        std::string text;
        TextSize size;
        bool newline;
    };

    struct TextReferenceComponent : public Component {
        TextReferenceComponent(std::string * ref, bool newline, int x, int y, TextSize size) 
            : reference(ref), size(size), newline(newline), Component(ComponentType::TEXT_REFERENCE, x, y) {}
        std::string * reference;
        TextSize size;
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
    bool is_mouse_over(int mouse_x, int mouse_y) const;
    bool click(int mouse_x, int mouse_y);   // Returns true if the widget was clicked
    void update();
    void render();

    void set_pos(int x, int y) { this->x = x; this->y = y; }
    int get_width() const { return width; }
    int get_height() const { return height; }
private:
    std::string name;
    bool m_update;

    // The position of the widget
    Anchor anchor;
    int width;
    int height;
    int x;
    int y;

    // The draw position of the widget
    int draw_x;
    int draw_y;
};